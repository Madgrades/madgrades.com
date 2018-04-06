import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import utils from "../utils";

class SubjectName extends Component {
  static propTypes = {
    code: PropTypes.string,
    abbreviate: PropTypes.bool,
    fallback: PropTypes.string,
    data: PropTypes.object
  };

  componentWillMount = () => {
    const { actions, code, data } = this.props;

    if (!data) {
      actions.fetchSubject(code);
    }
  };

  render = () => {
    const { name, abbreviation, abbreviate, fallback } = this.props;

    const text = abbreviate ? abbreviation : name;
    return <span>{text || fallback}</span>
  }
}

function mapStateToProps(state, ownProps) {
  const { code, data } = ownProps;

  if (data) {
    return {
      name: data.name,
      abbreviation: data.abbreviation
    }
  }

  const { subjects } = state;
  const subjectData = subjects.data[code];

  return {
    name: subjectData && subjectData.name,
    abbreviation: subjectData && subjectData.abbreviation
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(SubjectName)
