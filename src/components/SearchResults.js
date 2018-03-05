import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Dimmer, Loader, Tab} from "semantic-ui-react";
import Div from "../containers/Div";
import InstructorSearchResultItem from "../containers/InstructorSearchResultItem";
import CourseSearchResults from "./CourseSearchResults";
import InstructorSearchResults from "./InstructorSearchResults";
import SearchBox from "./SearchBox";
import {withRouter} from "react-router";

class SearchResults extends Component {
  componentDidUpdate = () => {
    this.props.actions.fetchInstructorSearch(this.props.searchQuery, 1);
    this.props.actions.fetchCourseSearch(this.props.searchQuery, 1);
  };

  panes = () => {
    const { courseCount, instructorCount } = this.props;

    return [
      {
        menuItem: courseCount === undefined ? "Courses" : `Courses (${courseCount})`,
        render: () => <CourseSearchResults/>
      },
      {
        menuItem: instructorCount === undefined ? "Instructors" : `Instructors (${instructorCount})`,
        render: () => <InstructorSearchResults/>
      }
    ];
  };

  onTabChange = (event, data) => {
    this.props.history.push(`/search/${this.props.query}/${data.activeIndex}`)
  };

  render = () => {
    return (
        <div>
          <SearchBox/>
          <Tab
              menu={{ secondary: true, pointing: true }}
              panes={this.panes()}
              onTabChange={this.onTabChange}
              activeIndex={this.props.tab}/>
        </div>
    )
  }
}

function mapStateToProps(state) {
  const searchQuery = state.app.searchQuery;

  const instructorSearch = state.instructors.searches[searchQuery];
  const courseSearch = state.courses.searches[searchQuery];

  let instructorCount = instructorSearch && instructorSearch[1] && instructorSearch[1].results && instructorSearch[1].results.length;
  let courseCount = courseSearch && courseSearch[1] && courseSearch[1].results && courseSearch[1].results.length;

  return {
    searchQuery,
    instructorCount: instructorCount,
    courseCount: courseCount
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(SearchResults))
