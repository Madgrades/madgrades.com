import React, { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { Input, InputOnChangeData } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const searchQuery = useAppSelector(state => state.app.searchQuery);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  const performSearch = (): void => {
    navigate(`/search?query=${searchValue}`);
  };

  const onInputChange = (_event: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    setSearchValue(data.value);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      performSearch();
      (event.target as HTMLInputElement).blur();
    }
  };

  return (
    <Input
      className="SearchBox"
      style={{ minWidth: "250px" }}
      value={searchValue}
      onChange={onInputChange}
      onKeyPress={onKeyPress}
      icon={{
        name: "search",
        link: true,
        onClick: performSearch,
        title: "Perform Search",
      }}
      placeholder="Search..."
      fluid
    />
  );
};

export default SearchBox;
