import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';

interface LatestTermProps extends PropsFromRedux {}

function LatestTerm({ actions, terms }: LatestTermProps) {
  useEffect(() => {
    actions.fetchTerms();
  }, [actions]);

  const latestTermName = () => {
    if (terms) {
      const latestTerm = Math.max(...Object.keys(terms).map((key) => parseInt(key, 10)));
      return utils.termCodes.toName(latestTerm);
    }
    return 'Unknown';
  };

  return <span>{latestTermName()}</span>;
}

function mapStateToProps(state: RootState) {
  return {
    terms: state.app.terms || {},
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LatestTerm);