import React from "react";
import SetSearchQuery from "../components/SetSearchQuery";
import {Container} from "semantic-ui-react";
import SearchResults from "../components/SearchResults";

const Search = ({match}) => (
    <Container className="Search">
      <br/>
      <SearchResults query={match.params.query} tab={match.params.tab || 0}/>
      <SetSearchQuery query={match.params.query}/>
    </Container>
);
export default Search;