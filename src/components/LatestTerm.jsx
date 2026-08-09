import React, {Component} from 'react';
import {connect} from 'react-redux';
import utils from '../utils';

class LatestTerm extends Component {
  componentDidMount = () => {
    this.props.actions.fetchTerms();
  }

  latestTermName = () => {
    const { terms } = this.props;

    if (terms) {
      const latestTerm = Math.max(...Object.keys(terms).map(key => parseInt(key, 10)));
      return utils.termCodes.toName(latestTerm);
    }
    else {
      return "Unknown";
    }
  }

  render = () => {
    return <span>{this.latestTermName()}</span>
  }
}

function mapStateToProps(state, ownProps) {
  return {
    terms: state.app.terms || {}
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(LatestTerm)