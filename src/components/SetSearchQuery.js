import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types";

/**
 * When rendered or updated, the global app
 * search updates to the prop for this component.
 */
class SetSearchQuery extends Component {
  static propTypes = {
    query: PropTypes.string
  };

  setSearchQuery = () => {
    const { query, actions } = this.props;
    actions.setSearchQuery(query, 1);
  };

  componentDidMount = this.setSearchQuery;

  componentDidUpdate = this.setSearchQuery;

  render = () => null;
}

function mapStateToProps(state, ownProps) {
  return {
    searchQuery: state.app.searchQuery
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(SetSearchQuery)
