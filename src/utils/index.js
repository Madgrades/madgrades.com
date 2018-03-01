import * as api from "./api";
import * as grades from "./grades";
import * as termCodes from "./termCodes";
import {bindActionCreators} from "redux";
import actions from "../redux/actions";

const utils = {
  api,
  termCodes,
  grades,
  mapDispatchToProps: (dispatch) => {
    return {
      actions: bindActionCreators(actions, dispatch)
    }
  },
  round: (number, places) => {
    return +(Math.round(number + "e+" + places) + "e-" + places);
  },
  numberWithCommas: (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
export default utils;