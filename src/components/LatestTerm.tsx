import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTerms } from '../store/slices/appSlice';
import utils from '../utils';

const LatestTerm: React.FC = () => {
  const dispatch = useAppDispatch();
  const terms = useAppSelector(state => state.app.terms);

  useEffect(() => {
    dispatch(fetchTerms());
  }, [dispatch]);

  const latestTermName = (): string => {
    if (terms && terms.length > 0) {
      const latestTermCode = Math.max(...terms.map(t => t.code));
      return utils.termCodes.toName(latestTermCode);
    }
    else {
      return "Unknown";
    }
  };

  return <span>{latestTermName()}</span>;
};

export default LatestTerm;
