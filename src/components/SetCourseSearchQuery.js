import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types";

class SetCourseSearchQuery extends Component {
  static propTypes = {
    query: PropTypes.string
  };

  setCourseSearchQuery = () => {
    const { query, actions } = this.props;
    actions.setCourseSearchQuery(query, 1);
  };

  componentDidMount = this.setCourseSearchQuery;

  componentDidUpdate = this.setCourseSearchQuery;

  render = () => null;
}

function mapStateToProps(state, ownProps) {
  return {
    courseSearchQuery: state.app.courseSearchQuery
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(SetCourseSearchQuery)
