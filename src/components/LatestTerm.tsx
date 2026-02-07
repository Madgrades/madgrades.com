import React, { Component, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTerms } from '../store/slices/appSlice';
import utils from '../utils';
import { Term } from '../types/api';

interface LatestTermClassProps {
  terms: Term[] | undefined;
}

class LatestTermClass extends Component<LatestTermClassProps> {
  latestTermName = (): string => {
    const { terms } = this.props;

    if (terms && terms.length > 0) {
      const latestTermCode = Math.max(...terms.map(t => t.code));
      return utils.termCodes.toName(latestTermCode);
    }
    else {
      return "Unknown";
    }
  };

  render = (): JSX.Element => {
    return <span>{this.latestTermName()}</span>;
  };
}

const LatestTerm: React.FC = () => {
  const dispatch = useAppDispatch();
  const terms = useAppSelector(state => state.app.terms);

  useEffect(() => {
    dispatch(fetchTerms());
  }, [dispatch]);

  return <LatestTermClass terms={terms} />;
};

export default LatestTerm;
