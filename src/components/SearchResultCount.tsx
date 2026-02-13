import React, {Component} from 'react';
import {connect} from 'react-redux';
import utils from '../utils';

class SearchResultCount extends Component {
  render = () => {
    const { count } = this.props;

    return <span>{utils.numberWithCommas(count)}</span>
  }
}

function mapStateToProps(state, ownProps) {
  const { search } = state.courses;

  const { page } = state.app.courseFilterParams || 1;

  let count = search && search.pages && search.pages[page] && search.pages[page].totalCount;

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
