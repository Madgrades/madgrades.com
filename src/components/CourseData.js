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
    const { actions, uuid, data, onDataLoad } = this.props;
    actions.fetchCourse(uuid);

    if (data && !data.isFetching) {
      onDataLoad(data);
    }
  };

  componentDidMount = this.fetchData;

  componentDidUpdate = (prevProps) => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchData();
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
