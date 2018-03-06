import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import utils from "../utils";

class AdvancedSearchResultCount extends Component {
  render = () => {
    const { count } = this.props;

    return <span>{count === 100 ? "100+" : utils.numberWithCommas(count)}</span>
  }
}

function mapStateToProps(state, ownProps) {
  const { advancedSearch } = state.courses;

  let count = advancedSearch && advancedSearch.pages && advancedSearch.pages[1]
    && advancedSearch.pages[1].results.length;

  if (count) {
    return {
      count
    }
  }
  else {
    return {
      count: 0
    }
  }
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(AdvancedSearchResultCount)
