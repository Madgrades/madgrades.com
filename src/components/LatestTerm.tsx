import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';

function LatestTerm({ actions, terms }: PropsFromRedux) {
  useEffect(() => {
    actions.fetchTerms();
  }, [actions]);

  const latestTermName = () => {
    const termKeys = Object.keys(terms);
    if (termKeys.length > 0) {
      const latestTerm = Math.max(...termKeys.map(key => parseInt(key, 10)));
      return utils.termCodes.toName(latestTerm);
    }
    return 'Unknown';
  };

  return <span>{latestTermName()}</span>;
}

function mapStateToProps(state: RootState) {
  return {
    terms: state.app.terms,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(LatestTerm);
