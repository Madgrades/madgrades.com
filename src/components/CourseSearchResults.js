import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Container, Dimmer, Loader, Segment} from "semantic-ui-react";
import CourseSearchResult from "../containers/CourseSearchResult";

class CourseSearchResults extends Component {
  componentDidUpdate = () => {
    const { actions, courseSearchQuery } = this.props;
    actions.fetchCourseSearch(courseSearchQuery, 1);
  };

  renderResults = (results) => results.map(result => {
    return (
        <div key={result.uuid}>
          <CourseSearchResult result={result}/>
          <br/>
        </div>
    )
  });

  render = () => {
    const { searchData } = this.props;

    if (!searchData) {
      return (
          <Container>
            What
          </Container>
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
        <Container>
          {this.renderResults(results)}
        </Container>
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
