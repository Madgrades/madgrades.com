import { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { Button, Divider, Form, Input } from 'semantic-ui-react';
import EntitySelect from './EntitySelect';
import { useNavigate } from 'react-router-dom';
import { RootState, CourseFilterParams } from '../types';

interface OwnProps {
  navigate: (path: string) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseFilterForm({ courseFilterParams, navigate }: Props) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [instructors, setInstructors] = useState<number[]>([]);
  const [query, setQuery] = useState<string | undefined>(undefined);

  useEffect(() => {
    const { subjects: s, instructors: i, query: q } = courseFilterParams;
    setSubjects(s || []);
    setInstructors(i || []);
    setQuery(q);
  }, [courseFilterParams]);

  const onSubjectChange = (newSubjects: string[] | number[]) => {
    setSubjects(newSubjects as string[]);
  };

  const onInstructorChange = (newInstructors: string[] | number[]) => {
    setInstructors(newInstructors as number[]);
  };

  const onQueryChange = (
    _event: React.ChangeEvent<HTMLInputElement>,
    { value }: { value: string }
  ) => {
    setQuery(value);
  };

  const onClear = (event: React.MouseEvent) => {
    event.preventDefault();
    setSubjects([]);
    setInstructors([]);
    setQuery(undefined);
  };

  const onSubmit = () => {
    const allParams: CourseFilterParams = {
      ...courseFilterParams,
      subjects,
      instructors,
      query,
      page: 1,
    };

    // Preserve compareWith parameter if it exists
    if (courseFilterParams.compareWith) {
      allParams.compareWith = courseFilterParams.compareWith;
    }

    navigate(`/search?${  utils.buildQueryString(allParams)}`);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <label>Search</label>
        <Input
          placeholder="i.e. Math 222, Music in Performance"
          value={query || ''}
          onChange={onQueryChange}
        />
      </Form.Field>
      <Divider horizontal content="Filter" className="divider-small" />
      <Form.Field>
        <label>Subjects</label>
        <EntitySelect value={subjects || []} onChange={onSubjectChange} entityType="subject" />
      </Form.Field>
      <Form.Field>
        <label>Instructors</label>
        <EntitySelect
          value={instructors || []}
          onChange={onInstructorChange}
          entityType="instructor"
        />
      </Form.Field>
      <Form.Button positive floated="right">
        Search
      </Form.Button>
      <Button onClick={onClear} floated="left">
        Clear
      </Button>
    </Form>
  );
}

function mapStateToProps(state: RootState) {
  return {
    courseFilterParams: state.app.courseFilterParams,
  };
}

// HOC to inject navigate as prop
function withNavigate<P extends object>(Component: React.ComponentType<P>) {
  return function ComponentWithNavigate(props: P) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(withNavigate(CourseFilterForm));
