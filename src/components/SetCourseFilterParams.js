import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types";

class SetCourseFilterParams extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  setCourseFilterParams = () => {
    const { params, actions } = this.props;
    actions.setCourseFilterParams(params);
    actions.fetchAdvancedCourseSearch(params, 1);
  };

  componentDidMount = this.setCourseFilterParams;

  componentDidUpdate = this.setCourseFilterParams;

  render = () => null;
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(SetCourseFilterParams)
