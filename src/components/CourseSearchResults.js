import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Dimmer, Loader} from "semantic-ui-react";
import CourseSearchResultItem from "../containers/CourseSearchResultItem";
import Div from "../containers/Div";
import {Link} from "react-router-dom";

const exampleCourses = [
    "Physics 103", "Music in Performance", "MATH 222", "cs graphics",
    "Art 100", "Geoscience 331"
];

const exampleQueries = exampleCourses.map(name => (
    <li key={name}>
      <Link to={`/search/${name}`}>{name}</Link>
    </li>
));

class CourseSearchResults extends Component {
  componentDidUpdate = () => {
    const { actions, searchQuery } = this.props;
    actions.fetchCourseSearch(searchQuery, 1);
  };

  renderResults = (results) => results.map(result => {
    return (
        <div key={result.uuid} style={{marginBottom: "10px"}}>
          <CourseSearchResultItem result={result}/>
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
            No courses were found for your query. Note that we don't have every course name, so try searching
            by subject and course number (i.e. Math 221, English 120).
          </p>
          <p>
            <strong>Examples:</strong>
          </p>
          <ul>
            {exampleQueries}
          </ul>
          <p>
            See the <Link to="/about">about</Link> page to report an issue.
          </p>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const { searchQuery } = state.app;

  const queryResults = state.courses.searches[searchQuery];

  const searchData = queryResults && queryResults[1];

  return {
    searchQuery,
    searchData: searchData || {}
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseSearchResults)
