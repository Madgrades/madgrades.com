import React, { Component, useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { Input, InputOnChangeData } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

interface SearchBoxProps {
  searchQuery: string;
  navigate: (path: string) => void;
}

interface SearchBoxState {
  searchValue: string;
}

class SearchBoxClass extends Component<SearchBoxProps, SearchBoxState> {
  state: SearchBoxState = {
    searchValue: "",
  };

  componentDidMount(): void {
    this.setState({
      searchValue: this.props.searchQuery,
    });
  }

  componentDidUpdate = (prevProps: SearchBoxProps): void => {
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.setState({
        searchValue: this.props.searchQuery,
      });
    }
  };

  performSearch = (): void => {
    const { searchValue } = this.state;
    this.props.navigate(`/search?query=${searchValue}`);
  };

  onInputChange = (_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    this.setState({
      searchValue: data.value,
    });
  };

  onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      this.performSearch();
      (event.target as HTMLInputElement).blur();
    }
  };

  render = (): JSX.Element => {
    const { searchValue } = this.state;

    return (
      <Input
        className="SearchBox"
        style={{ minWidth: "250px" }}
        value={searchValue}
        onChange={this.onInputChange}
        onKeyPress={this.onKeyPress}
        icon={{
          name: "search",
          link: true,
          onClick: this.performSearch,
          title: "Perform Search",
        }}
        placeholder="Search..."
        fluid
      />
    );
  };
}

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const searchQuery = useAppSelector(state => state.app.searchQuery);

  return <SearchBoxClass searchQuery={searchQuery} navigate={navigate} />;
};

export default SearchBox;
