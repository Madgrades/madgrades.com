import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Container, Dimmer, Loader, Segment} from "semantic-ui-react";
import CourseSearchResult from "../containers/CourseSearchResult";

class CourseSearchResults extends Component {
  componentDidUpdate = () => {
    const { actions, courseSearchQuery } = this.props;

    if (courseSearchQuery)
      actions.fetchCourseSearch(courseSearchQuery, 1);
  };

  renderResults = (results) => results.map(result => {
    return (
        <div key={result.uuid} style={{marginBottom: "10px"}}>
          <CourseSearchResult result={result}/>
        </div>
    )
  });

  render = () => {
    const { searchData } = this.props;

    console.log("DATA", searchData);

    if (!searchData) {
      return (
          <div>
            Finding a course is easy, just use the search box above!
          </div>
      )
    }
    else if (searchData.isFetching) {
      return (
          <Dimmer.Dimmable as={Container}>
            <Dimmer active inverted>
              <Loader disabled={false} inverted inline>Loading</Loader>
            </Dimmer>
          </Dimmer.Dimmable>
      )
    }

    const { results } = searchData;

    return (
        <div>
          {this.renderResults(results)}
        </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { courseSearchQuery } = state.app;

  const queryResults = state.courses.searches[courseSearchQuery];

  const searchData = queryResults && queryResults[1];

  return {
    courseSearchQuery,
    searchData
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseSearchResults)
