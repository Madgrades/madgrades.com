import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  data?: Instructor | Subject;
}

interface EntitySelectProps {
  entityType: EntityType;
  onChange?: (entityKeys: (string | number)[]) => void;
  value?: (string | number)[];
}

const EntitySelect: React.FC<EntitySelectProps> = ({ 
  entityType, 
  onChange = (_entityKey: (string | number)[]): void => {}, 
  value = [] 
}) => {
  const dispatch = useAppDispatch();
  
  const instructorState = useAppSelector(state => state.instructors);
  const subjectState = useAppSelector(state => state.subjects);

  const entityState = entityType === 'instructor' ? instructorState : subjectState;
  const searches = entityState.searches;
  const entityData = entityState.data;

  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const performSearch = useCallback((searchQuery: string): void => {
    switch (entityType) {
      case 'instructor':
        dispatch(fetchInstructorSearch({ query: searchQuery, page: 1 }));
        return;
      case 'subject':
        dispatch(fetchSubjectSearch({ query: searchQuery, page: 1 }));
        return;
    }
  }, [dispatch, entityType]);

  const requestEntity = useCallback((key: EntityKey): void => {
    switch (entityType) {
      case 'instructor':
        dispatch(fetchInstructor(key as number));
        return;
      case 'subject':
        dispatch(fetchSubject(key as string));
        return;
    }
  }, [dispatch, entityType]);

  const entityToKey = useCallback((entity: Instructor | Subject): EntityKey => {
    switch (entityType) {
      case 'instructor':
        return (entity as Instructor).id;
      case 'subject':
        return (entity as Subject).code;
    }
  }, [entityType]);

  const entityToOption = useCallback((key: EntityKey, entityWrapper: EntityData): EntityOption => {
    if (entityWrapper.isFetching || !entityWrapper.data) {
      return {
        key: key,
        value: key,
        text: `${key} (Loading...)`
      };
    }
    const entity = entityWrapper.data;
    switch (entityType) {
      case 'instructor':
        const instructor = entity as Instructor;
        return {
          key: instructor.id,
          value: instructor.id,
          text: instructor.name || ''
        };
      case 'subject':
        const subject = entity as Subject;
        return {
          key: subject.code,
          value: subject.code,
          text: subject.name || ''
        };
    }
  }, [entityType]);

  const handleChange = (_event: React.SyntheticEvent<HTMLElement>, { value: newValue }: DropdownProps): void => {
    setQuery('');
    onChange(newValue as (string | number)[]);
  };

  const handleSearchChange = (_event: React.SyntheticEvent<HTMLElement>, { searchQuery }: DropdownProps): void => {
    const newQuery = searchQuery as string;
    setQuery(newQuery);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      performSearch(newQuery);
    }, 500);
  };

  useEffect(() => {
    const searchData = query.length >= 2 ? searches[query]?.[1] : undefined;

    const newOptions: EntityOption[] = [];
    const keys = new Set<EntityKey>();

    for (const keyStr of Object.keys(entityData)) {
      const entityWrapper = entityData[keyStr];
      if (!entityWrapper || !entityWrapper.data) continue;
      const entity = entityWrapper.data;
      const key = entityToKey(entity);
      newOptions.push(entityToOption(key, entityWrapper));
      keys.add(key);
    }

    for (const key of value) {
      if (!keys.has(key)) {
        newOptions.push({
          key: key,
          value: key,
          text: `${key} (Loading...)`
        });
        requestEntity(key);
        keys.add(key);
      }
    }

    const newIsFetching = searchData?.isFetching || false;

    let filteredOptions = newOptions;

    if (searchData && !searchData.isFetching && searchData.data?.results) {
      const searchKeys = searchData.data.results.map((e: Instructor | Subject) => entityToKey(e));
      filteredOptions = newOptions.filter(o => searchKeys.includes(o.key) || value.includes(o.key));
    } else {
      filteredOptions = newOptions.filter(o => value.includes(o.key));
    }

    if (!_.isEqual(options, filteredOptions)) {
      setOptions(filteredOptions);
    }

    if (isFetching !== newIsFetching) {
      setIsFetching(newIsFetching);
    }
  }, [entityType, entityData, searches, value, query, entityToKey, entityToOption, requestEntity, options, isFetching]);

  const message = useMemo(() => {
    if (query.length < 2) {
      return 'Start typing to see results';
    } else if (isTyping || isFetching) {
      return 'Searching...';
    } else {
      return 'No results found';
    }
  }, [query, isTyping, isFetching]);

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
};

export default EntitySelect;
