import React, { Component } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import _ from 'lodash';
import { fetchInstructor, fetchInstructorSearch } from '../store/slices/instructorsSlice';
import { fetchSubject, fetchSubjectSearch } from '../store/slices/subjectsSlice';
import { Instructor, Subject } from '../types/api';

type EntityType = 'instructor' | 'subject';
type EntityKey = number | string;

interface EntityOption {
  key: EntityKey;
  value: EntityKey;
  text: string;
}

interface EntityData {
  isFetching?: boolean;
  id?: number;
  name?: string;
  code?: string;
}

interface SearchPageData {
  isFetching: boolean;
  results?: (Instructor | Subject)[];
}

interface EntitySelectProps {
  entityType: EntityType;
  onChange?: (entityKeys: (string | number)[]) => void;
  value?: (string | number)[];
}

interface EntitySelectClassProps extends EntitySelectProps {
  searches: Record<string, Record<number, SearchPageData>>;
  entityData: Record<string, EntityData>;
  dispatch: ReturnType<typeof useAppDispatch>;
}

interface EntitySelectState {
  query: string;
  options: EntityOption[];
  isTyping: boolean;
  isFetching: boolean;
}

class EntitySelectClass extends Component<EntitySelectClassProps, EntitySelectState> {
  static defaultProps = {
    value: [],
    onChange: (_entityKey: (string | number)[]): void => { }
  };

  state: EntitySelectState = {
    query: '',
    options: [],
    isTyping: false,
    isFetching: false
  };

  performSearch = (query: string): void => {
    const { dispatch, entityType } = this.props;
    
    switch (entityType) {
      case 'instructor':
        dispatch(fetchInstructorSearch({ query, page: 1 }));
        return;
      case 'subject':
        dispatch(fetchSubjectSearch({ query, page: 1 }));
        return;
      default:
        return;
    }
  };

  requestEntity = (key: EntityKey, entityType: EntityType): void => {
    const { dispatch } = this.props;
    
    switch (entityType) {
      case 'instructor':
        dispatch(fetchInstructor(key as number));
        return;
      case 'subject':
        dispatch(fetchSubject(key as string));
        return;
      default:
        return;
    }
  };

  entityToKey = (entity: Instructor | Subject, entityType: EntityType): EntityKey => {
    switch (entityType) {
      case 'instructor':
        return (entity as Instructor).id;
      case 'subject':
        return (entity as Subject).code;
      default:
        return '';
    }
  };

  entityToOption = (key: EntityKey, entity: EntityData, entityType: EntityType): EntityOption => {
    if (entity.isFetching) {
      return {
        key: key,
        value: key,
        text: `${key} (Loading...)`
      };
    }
    else {
      switch (entityType) {
        case 'instructor':
          return {
            key: entity.id!,
            value: entity.id!,
            text: entity.name || ''
          };
        case 'subject':
          return {
            key: entity.code!,
            value: entity.code!,
            text: entity.name || ''
          };
        default:
          return {
            key: key,
            value: key,
            text: ''
          };
      }
    }
  };

  onChange = (_event: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void => {
    this.setState({
      query: ''
    });
    this.props.onChange!(value as (string | number)[]);
  };

  onSearchChange = (_event: React.SyntheticEvent<HTMLElement>, { searchQuery }: DropdownProps): void => {
    this.setState({
      query: searchQuery as string,
      isTyping: true
    });

    setTimeout(() => {
      if (this.state.query === searchQuery) {
        this.setState({
          isTyping: false
        });
        this.performSearch(searchQuery as string);
      }
    }, 500);
  };

  componentDidUpdate = (): void => {
    const { entityType, entityData, searches, value } = this.props;
    const { query } = this.state;

    let searchData: SearchPageData | undefined;

    if (query.length >= 2) {
      searchData = searches[query]?.[1];
    }

    const options: EntityOption[] = [];
    const keys = new Set<EntityKey>();

    for (const keyStr of Object.keys(entityData)) {
      const entity = entityData[keyStr];
      if (!entity) continue;
      const key = this.entityToKey(entity as (Instructor | Subject), entityType);
      options.push(this.entityToOption(key, entity, entityType));
      keys.add(key);
    }

    for (const key of value || []) {
      if (!keys.has(key)) {
        options.push({
          key: key,
          value: key,
          text: `${key} (Loading...)`
        });
        this.requestEntity(key, entityType);
        keys.add(key);
      }
    }

    const isFetching = searchData?.isFetching || false;

    let filteredOptions = options;

    if (searchData && !searchData.isFetching && searchData.results) {
      const searchKeys = searchData.results.map(e => this.entityToKey(e, entityType));
      filteredOptions = options.filter(o => searchKeys.includes(o.key) || (value || []).includes(o.key));
    } else {
      filteredOptions = options.filter(o => (value || []).includes(o.key));
    }

    if (!_.isEqual(this.state.options, filteredOptions)) {
      this.setState({
        options: filteredOptions,
        isFetching
      });
    }

    if (this.state.isFetching !== isFetching) {
      this.setState({
        isFetching
      });
    }
  };

  componentDidMount = (): void => {
    this.componentDidUpdate();
  };

  render = () => {
    const { options, isFetching, isTyping, query } = this.state;
    const { value, entityType } = this.props;

    let message = 'No results found';
    if (query.length < 2)
      message = 'Start typing to see results';
    else if (isTyping || isFetching)
      message = 'Searching...';

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
        onChange={this.onChange}
        onSearchChange={this.onSearchChange}
        search={options => options}
      />
    );
  };
}

const EntitySelect: React.FC<EntitySelectProps> = (props) => {
  const dispatch = useAppDispatch();
  const { entityType } = props;

  const instructorState = useAppSelector(state => state.instructors);
  const subjectState = useAppSelector(state => state.subjects);

  const entityState = entityType === 'instructor' ? instructorState : subjectState;

  return (
    <EntitySelectClass
      {...props}
      searches={entityState.searches}
      entityData={entityState.data}
      dispatch={dispatch}
    />
  );
};

export default EntitySelect;
