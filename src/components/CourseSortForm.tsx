import { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { Dropdown } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { stringify } from 'qs';
import { RootState, CourseFilterParams } from '../types';

const sortOptions = [
  {
    key: 'relevance',
    text: 'Best Match',
    value: 'relevance',
  },
  {
    key: 'number',
    text: 'Number (Lowest First)',
    value: 'number',
  },
  {
    key: 'number_desc',
    text: 'Number (Highest First)',
    value: 'number_desc',
  },
];

interface OwnProps {
  navigate: (path: string) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseSortForm({ courseFilterParams, navigate }: Props) {
  const [value, setValue] = useState('number');

  useEffect(() => {
    const { sort, order } = courseFilterParams;
    let newValue;

    if (!sort) {
      newValue = 'relevance';
    } else if (sort === 'relevance') {
      newValue = 'relevance';
    } else if (sort === 'number') {
      newValue = 'number';
      if (order === 'desc') newValue = 'number_desc';
    }

    if (newValue && newValue !== value) {
      setValue(newValue);
    }
  }, [courseFilterParams, value]);

  const handleChange = (event: any, { value: newValue }: { value: string }) => {
    setValue(newValue);

    let sort, order;

    if (newValue === 'number') {
      sort = 'number';
    } else if (newValue === 'number_desc') {
      sort = 'number';
      order = 'desc';
    } else if (newValue === 'relevance') {
      // nothing to do
    }

    const params = {
      ...courseFilterParams,
      sort,
      order,
    };
    navigate('/search?' + stringify(params, { encode: false }));
  };

  return (
    <Dropdown
      inline
      direction="left"
      header="Sort options"
      options={sortOptions}
      value={value}
      onChange={handleChange}
    />
  );
}

function mapStateToProps(state: RootState) {
  return {
    courseFilterParams: state.app.courseFilterParams,
  };
}

// HOC to inject navigate as prop
function withNavigate(Component: React.ComponentType<any>) {
  return function ComponentWithNavigate(props: any) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(withNavigate(CourseSortForm));
