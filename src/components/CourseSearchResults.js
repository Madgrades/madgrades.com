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
    courseFilterParams: PropTypes.object
  };

  componentWillReceiveProps = (nextProps) => {
    const { actions, courseFilterParams } = nextProps;

    if (!_.isEqual(courseFilterParams, this.props.courseFilterParams)) {
      actions.fetchCourseSearch(courseFilterParams, 1);
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

function mapStateToProps(state) {
  const { searchQuery, courseFilterParams } = state.app;

  let searchData, isFetching;

  const search = state.courses.search;
  searchData = search.pages && search.pages[1];
  isFetching = search.isFetching;

  return {
    searchQuery,
    courseFilterParams,
    isFetching,
    searchData: searchData || {}
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseSearchResults)
