import React from 'react';
import { useAppSelector } from '../store/hooks';
import utils from '../utils';

const SearchResultCount: React.FC = () => {
  const courseSearch = useAppSelector(state => state.courses.search);
  
  const page = 1;
  const pageData = courseSearch?.pages?.[page];
  const count = pageData?.total || 0;

  return <span>{utils.numberWithCommas(count)}</span>;
};

export default SearchResultCount;
