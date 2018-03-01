import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";

class Template extends Component {
  componentWillMount = () => {
    const { actions } = this.props;
  };

  render = () => {
    return <div>Template</div>
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(Template)
