import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import utils from "../utils";

const selectName = (names) => names && names.filter(name => name !== null)[0];

class CourseName extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    fallback: PropTypes.string,
    data: PropTypes.object
  };

  componentWillMount = () => {
    const { data, actions, uuid } = this.props;

    if (!data) {
      actions.fetchCourse(uuid);
    }
  };

  render = () => {
    const { name, fallback } = this.props;
    return <span>{name || fallback}</span>
  }
}

function mapStateToProps(state, ownProps) {
  const { uuid, data } = ownProps;

  if (data) {
    return {
      name: selectName(data.names)
    }
  }

  const { courses } = state;
  const courseData = courses.data[uuid];

  return {
    name: courseData && selectName(courseData.names)
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseName)
