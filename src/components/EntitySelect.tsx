import { useState, useEffect, useCallback, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

type EntityType = 'instructor' | 'subject';

interface OwnProps {
  entityType: EntityType;
  onChange?: (value: any) => void;
  value?: any[];
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function EntitySelect({
  entityType,
  onChange = () => {},
  value = [],
  actions,
  searches,
  entityData,
}: Props) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(
    (searchQuery: string) => {
      switch (entityType) {
        case 'instructor':
          actions.fetchInstructorSearch(searchQuery, 1);
          return;
        case 'subject':
          actions.fetchSubjectSearch(searchQuery, 1);
          return;
        default:
          return;
      }
    },
    [entityType, actions]
  );

  const requestEntity = useCallback(
    (key: any) => {
      switch (entityType) {
        case 'instructor':
          actions.fetchInstructor(key);
          return;
        case 'subject':
          actions.fetchSubject(key);
          return;
        default:
          return;
      }
    },
    [entityType, actions]
  );

  const entityToKey = (entity: any): any => {
    switch (entityType) {
      case 'instructor':
        return entity.id;
      case 'subject':
        return entity.code;
      default:
        return;
    }
  };

  const entityToOption = (key: any, entity: any) => {
    if (entity.isFetching) {
      return {
        key: key,
        value: key,
        text: `${key} (Loading...)`,
      };
    } else {
      switch (entityType) {
        case 'instructor':
          return {
            key: entity.id,
            value: entity.id,
            text: entity.name,
          };
        case 'subject':
          return {
            key: entity.code,
            value: entity.code,
            text: entity.name,
          };
        default:
          return;
      }
    }
  };

  const handleChange = (event: any, { value: newValue }: { value: any }) => {
    setQuery('');
    onChange(newValue);
  };

  const handleSearchChange = (event: any, { searchQuery }: { searchQuery: string }) => {
    setQuery(searchQuery);
    setIsTyping(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setIsTyping(false);
      performSearch(searchQuery);
    }, 500);
  };

  useEffect(() => {
    let searchData;

    if (query.length >= 2) {
      searchData = searches[query] && searches[query][1];
    }

    let newOptions: any[] = [];
    const keys = new Set();

    for (const keyStr of Object.keys(entityData)) {
      const entity = entityData[keyStr];
      const key = entityToKey(entity);
      newOptions.push(entityToOption(key, entity));
      keys.add(key);
    }

    for (const key of value) {
      if (!keys.has(key)) {
        newOptions.push({
          key: key,
          value: key,
          text: `${key} (Loading...)`,
        });
        requestEntity(key);
        keys.add(key);
      }
    }

    const newIsFetching = searchData && searchData.isFetching;

    // if we are searching, only show options found in the search
    if (searchData && !searchData.isFetching) {
      const searchKeys = searchData.results.map((e: any) => entityToKey(e));
      newOptions = newOptions.filter((o) => searchKeys.includes(o.key) || value.includes(o.key));
    }
    // otherwise the only options are the already selected values
    else {
      newOptions = newOptions.filter((o) => value.includes(o.key));
    }

    // only update if options are new, we don't want infinite loop
    if (!_.isEqual(options, newOptions)) {
      setOptions(newOptions);
      setIsFetching(!!newIsFetching);
    }

    if (isFetching !== newIsFetching) {
      setIsFetching(!!newIsFetching);
    }
  }, [entityType, entityData, searches, value, query, requestEntity]);

  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  let message = 'No results found';
  if (query.length < 2) message = 'Start typing to see results';
  else if (isTyping || isFetching) message = 'Searching...';

  return (
    <Dropdown
      placeholder={`Search ${entityType}s...`}
      noResultsMessage={message}
      fluid
      minCharacters={0}
      multiple
      scrolling={false}
      selection
      closeOnChange={true}
      loading={isFetching}
      options={options}
      value={value}
      searchQuery={query}
      onChange={handleChange}
      onSearchChange={handleSearchChange}
      search={(options) => options}
    />
  );
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  const { entityType } = ownProps;

  let entityState: any;

  switch (entityType) {
    case 'instructor':
      entityState = state.instructors;
      break;
    case 'subject':
      entityState = state.subjects;
      break;
    default:
      return {};
  }

  return {
    searches: entityState.searches,
    entityData: entityState.data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(EntitySelect);
