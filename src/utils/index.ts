import * as api from './api';
import * as grades from './grades';
import * as termCodes from './termCodes';
import {bindActionCreators, Dispatch} from 'redux';
import actions from '../redux/actions';

const utils = {
  api,
  termCodes,
  grades,
  mapDispatchToProps: (dispatch: Dispatch) => {
    return {
      actions: bindActionCreators(actions, dispatch)
    }
  },
  numberWithCommas: (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
};
export default utils;