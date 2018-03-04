import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Dimmer, Loader} from "semantic-ui-react";
import Div from "../containers/Div";
import InstructorSearchResultItem from "../containers/InstructorSearchResultItem";

class InstructorSearchResults extends Component {
  componentDidUpdate = () => {
    const { actions, searchQuery } = this.props;

    if (searchQuery)
      actions.fetchInstructorSearch(searchQuery, 1);
  };

  componentDidMount = () => {
    const { actions, searchQuery } = this.props;

    if (searchQuery)
      actions.fetchInstructorSearch(searchQuery, 1);
  };

  renderResults = (results) => results.map(result => {
    return (
        <div key={result.id} style={{marginBottom: "10px"}}>
          <InstructorSearchResultItem result={result}/>
        </div>
    )
  });

  render = () => {
    const { isFetching, results } = this.props.searchData;

    if (isFetching || (results && results.length > 0)) {
      return (
          <Dimmer.Dimmable as={Div}>
            <Dimmer active={isFetching} inverted>
              <Loader active={isFetching} inverted inline>Loading</Loader>
            </Dimmer>
            {this.renderResults(results || [])}
          </Dimmer.Dimmable>
      )
    }

    return (
        <div>
          <p>
            No instructors were found for your query.
          </p>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const { searchQuery } = state.app;

  const queryResults = state.instructors.searches[searchQuery];

  const searchData = queryResults && queryResults[1];

  return {
    searchQuery,
    searchData: searchData || {}
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(InstructorSearchResults)
