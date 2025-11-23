import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';

interface StateProps {
  count: number;
}

function SearchResultCount({ count }: PropsFromRedux) {
  return <span>{utils.numberWithCommas(count)}</span>;
}

function mapStateToProps(state: RootState): StateProps {
  const { search } = state.courses;
  const page = state.app.courseFilterParams?.page || 1;

  const count = search?.pages?.[page]?.totalCount;

  return {
    count: count || 0,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SearchResultCount);
