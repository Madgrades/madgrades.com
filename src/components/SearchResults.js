import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Dimmer, Loader, Tab} from "semantic-ui-react";
import Div from "../containers/Div";
import InstructorSearchResultItem from "../containers/InstructorSearchResultItem";
import CourseSearchResults from "./CourseSearchResults";
import InstructorSearchResults from "./InstructorSearchResults";
import SearchBox from "./SearchBox";

class SearchResults extends Component {
  state = {
    activeIndex: 0,
    autoTabbed: false
  };

  componentDidUpdate = () => {
    this.props.actions.fetchInstructorSearch(this.props.searchQuery, 1);
    this.props.actions.fetchCourseSearch(this.props.searchQuery, 1);
  };

  componentDidMount = () => {
    const { courseCount, instructorCount } = this.props;

    if (!this.state.autoTabbed) {
      if (instructorCount !== undefined && courseCount !== undefined) {
        this.setState({
          activeIndex: courseCount >= instructorCount ? 0 : 1,
          autoTabbed: true
        });
      }
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { courseCount, instructorCount } = nextProps;

    if (!this.state.autoTabbed) {
      if (instructorCount !== undefined && courseCount !== undefined) {
        this.setState({
          activeIndex: courseCount >= instructorCount ? 0 : 1,
          autoTabbed: true
        });
      }
    }
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
    this.setState({
      activeIndex: data.activeIndex
    })
  };

  render = () => {
    return (
        <div>
          <SearchBox/>
          <Tab
              menu={{ secondary: true, pointing: true }}
              panes={this.panes()}
              onTabChange={this.onTabChange}
              activeIndex={this.state.activeIndex}/>
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


export default connect(mapStateToProps, utils.mapDispatchToProps)(SearchResults)
