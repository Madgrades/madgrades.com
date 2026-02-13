import * as api from './api';
import * as grades from './grades';
import * as termCodes from './termCodes';

const utils = {
  api,
  termCodes,
  grades,
  numberWithCommas: (x: number): string => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};

export default utils;