import * as api from './api';
import * as grades from './grades';
import * as termCodes from './termCodes';
import * as math from './math';
import {bindActionCreators} from "redux";
import actions from '../redux/actions';

const utils = {
  api,
  termCodes,
  grades,
  math,
  mapDispatchToProps: (dispatch) => {
    return {
      actions: bindActionCreators(actions, dispatch)
    }
  }
};
export default utils;