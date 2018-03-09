import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";

class SearchResultCount extends Component {
  render = () => {
    const { count } = this.props;

    return <span>{count === 50 ? "50+" : utils.numberWithCommas(count)}</span>
  }
}

function mapStateToProps(state, ownProps) {
  const { search } = state.courses;

  let count = search && search.pages && search.pages[1]
    && search.pages[1].results && search.pages[1].results.length;

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


export default connect(mapStateToProps, utils.mapDispatchToProps)(SearchResultCount)
