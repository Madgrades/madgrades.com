import React from "react";
import SetSearchQuery from "../components/SetSearchQuery";
import {Container} from "semantic-ui-react";
import SearchResults from "../components/SearchResults";

const Search = ({match}) => (
    <Container className="Search">
      <br/>
      <SearchResults/>
      <SetSearchQuery query={match.params[0]}/>
    </Container>
);
export default Search;