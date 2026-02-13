import React, {Component} from 'react';
import {connect} from 'react-redux';
import utils from '../utils';
import PropTypes from 'prop-types'

class Template extends Component {
  static propTypes = {
    example: PropTypes.number
  };

  componentDidMount = () => {
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
