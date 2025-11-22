import { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { Input } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../types';

interface OwnProps {
  navigate: (path: string) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function SearchBox({ searchQuery, navigate }: Props) {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    // when we get an outside search value update, reflect that in the search box
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const performSearch = () => {
    navigate(`/search?query=${searchValue}`);
  };

  const onInputChange = (event: any, data: { value: string }) => {
    setSearchValue(data.value);
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      performSearch();
      (event.target as HTMLInputElement).blur();
    }
  };

  return (
    <Input
      className="SearchBox"
      style={{ minWidth: '250px' }}
      value={searchValue}
      onChange={onInputChange}
      onKeyPress={onKeyPress}
      icon={{
        name: 'search',
        link: true,
        onClick: performSearch,
        title: 'Perform Search',
      }}
      placeholder="Search..."
      fluid
    />
  );
}

function mapStateToProps(state: RootState) {
  return {
    searchQuery: state.app.searchQuery,
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
export default connector(withNavigate(SearchBox));
