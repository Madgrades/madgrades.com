import { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import utils from "../utils";

class CourseData extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    onDataLoad: PropTypes.func.isRequired,
  };

  fetchData = () => {
    const { actions, uuid } = this.props;
    actions.fetchCourse(uuid);
  };

  componentDidMount = () => {
    this.fetchData();
    this.notifyIfDataReady();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchData();
    }

    // Call onDataLoad when data changes and becomes available
    if (prevProps.data !== this.props.data) {
      this.notifyIfDataReady();
    }
  };

  notifyIfDataReady = () => {
    const { data, onDataLoad } = this.props;
    if (data && !data.isFetching) {
      onDataLoad(data);
    }
  };

  render = () => null;
}

function mapStateToProps(state, ownProps) {
  const { uuid } = ownProps;

  const { courses } = state;
  const data = courses.data[uuid];

  return {
    data,
  };
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseData);
