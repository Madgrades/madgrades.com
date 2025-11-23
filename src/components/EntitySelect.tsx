import { useState, useEffect, useCallback, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, Instructor, Subject } from '../types';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import _ from 'lodash';

type EntityType = 'instructor' | 'subject';
type EntityKey = number | string;
type Entity = Instructor | Subject;

interface EntityOption {
  key: EntityKey;
  value: EntityKey;
  text: string;
}

interface OwnProps {
  entityType: EntityType;
  onChange?: (value: EntityKey[]) => void;
  value?: EntityKey[];
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function EntitySelect({
  entityType,
  onChange = () => {
    /* no-op */
  },
  value = [],
  actions,
  searches,
  entityData,
}: Props) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    (key: EntityKey) => {
      switch (entityType) {
        case 'instructor':
          actions.fetchInstructor(key as number);
          return;
        case 'subject':
          actions.fetchSubject(key as string);
          return;
        default:
          return;
      }
    },
    [entityType, actions]
  );

  const entityToKey = (entity: Entity): EntityKey => {
    if ('id' in entity) {
      return entity.id;
    } else {
      return entity.code;
    }
  };

  const entityToOption = (
    key: EntityKey,
    entity: Entity | { isFetching: boolean }
  ): EntityOption => {
    if ('isFetching' in entity && entity.isFetching) {
      return {
        key: key,
        value: key,
        text: `${String(key)} (Loading...)`,
      };
    } else {
      const typedEntity = entity as Entity;
      if ('id' in typedEntity) {
        return {
          key: typedEntity.id,
          value: typedEntity.id,
          text: typedEntity.name,
        };
      } else {
        return {
          key: typedEntity.code,
          value: typedEntity.code,
          text: typedEntity.name,
        };
      }
    }
  };

  const handleChange = (_event: unknown, { value: newValue }: DropdownProps) => {
    setQuery('');
    onChange(newValue as EntityKey[]);
  };

  const handleSearchChange = (_event: unknown, { searchQuery }: DropdownProps) => {
    const query = searchQuery ?? '';
    setQuery(query);
    setIsTyping(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setIsTyping(false);
      performSearch(query);
    }, 500);
  };

  useEffect(() => {
    interface SearchData {
      isFetching?: boolean;
      results?: Entity[];
      totalCount?: number;
    }

    let searchData: SearchData | undefined;

    if (query.length >= 2) {
      const querySearches = searches[query];
      if (querySearches) {
        searchData = querySearches[1];
      }
    }

    const newOptions: EntityOption[] = [];
    const keys = new Set<EntityKey>();

    for (const keyStr of Object.keys(entityData)) {
      const entity = entityData[keyStr as keyof typeof entityData] as Entity;
      const key = entityToKey(entity);
      newOptions.push(entityToOption(key, entity));
      keys.add(key);
    }

    for (const key of value) {
      if (!keys.has(key)) {
        newOptions.push({
          key: key,
          value: key,
          text: `${String(key)} (Loading...)`,
        });
        requestEntity(key);
        keys.add(key);
      }
    }

    const newIsFetching = searchData?.isFetching;

    // if we are searching, only show options found in the search
    let filteredOptions = newOptions;
    if (searchData && !searchData.isFetching && searchData.results) {
      const searchKeys = searchData.results.map((e: Entity) => entityToKey(e));
      filteredOptions = newOptions.filter(o => searchKeys.includes(o.key) || value.includes(o.key));
    }
    // otherwise the only options are the already selected values
    else {
      filteredOptions = newOptions.filter(o => value.includes(o.key));
    }

    // only update if options are new, we don't want infinite loop
    if (!_.isEqual(options, filteredOptions)) {
      setOptions(filteredOptions);
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
  if (query.length < 2) {
    message = 'Start typing to see results';
  } else if (isTyping || isFetching) {
    message = 'Searching...';
  }

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
      search={options => options}
    />
  );
}

function mapStateToProps(state: RootState, ownProps: OwnProps) {
  const { entityType } = ownProps;

  switch (entityType) {
    case 'instructor':
      return {
        searches: state.instructors.searches || {},
        entityData: state.instructors.data,
      };
    case 'subject':
      return {
        searches: state.subjects.searches || {},
        entityData: state.subjects.data,
      };
    default:
      return {
        searches: {},
        entityData: {},
      };
  }
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(EntitySelect);
