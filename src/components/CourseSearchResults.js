import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Dimmer, Loader} from "semantic-ui-react";
import CourseSearchResultItem from "../containers/CourseSearchResultItem";
import Div from "../containers/Div";
import PropTypes from "prop-types";
import * as _ from "lodash";

class CourseSearchResults extends Component {
  static propTypes = {
    searchQuery: PropTypes.string,
    isAdvanced: PropTypes.bool
  };

  componentWillReceiveProps = (nextProps) => {
    const { actions, searchQuery, isAdvanced, courseFilterParams } = nextProps;

    if (isAdvanced) {
      if (!_.isEqual(courseFilterParams, this.props.courseFilterParams)) {
        actions.fetchAdvancedCourseSearch(courseFilterParams, 1);
      }
    }
    else {
      actions.fetchCourseSearch(searchQuery, 1);
    }
  };

  renderResults = (results) => results.map(result => {
    return (
        <div key={result.uuid} style={{marginBottom: "10px"}}>
          <CourseSearchResultItem result={result}/>
        </div>
    )
  });

  render = () => {
    const { isFetching } = this.props;
    const { results } = this.props.searchData;

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
            No courses were found for your search.
          </p>
        </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { searchQuery, courseFilterParams } = state.app;


  let searchData, isFetching;

  if (ownProps.isAdvanced) {
    const search = state.courses.advancedSearch;
    searchData = search.pages && search.pages[1];
    isFetching = search.isFetching;
  }
  else {
    const queryResults = state.courses.searches[searchQuery];
    searchData = queryResults && queryResults[1];
    isFetching = searchData && searchData.isFetching;
  }

  return {
    searchQuery,
    courseFilterParams,
    isFetching,
    searchData: searchData || {}
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseSearchResults)
