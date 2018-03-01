import React, {Component} from "react";
import PropTypes from "prop-types";
import {Dropdown} from "semantic-ui-react";
import utils from "../utils/index";

class TermSelect extends Component {
  static propTypes = {
    termCodes: PropTypes.arrayOf(PropTypes.number).isRequired,
    includeCumulative: PropTypes.bool
  };

  generateOptions = () => {
    const { includeCumulative } = this.props;
    let cumulativeOption = [];

    if (includeCumulative) {
      cumulativeOption = [
        {key: 0, value: 0, text: "Cumulative"}
      ];
    }

    const termOptions = this.props.termCodes.map(code => {
      return {
        key: code,
        value: code,
        text: utils.termCodes.toName(code)
      }
    });

    return cumulativeOption.concat(termOptions);
  };

  render = () => {
    const options = this.generateOptions();
    const defaultValue = options[0].value;

    return (
        <Dropdown
          selection
          defaultValue={defaultValue}
          options={options}/>
    )
  }
}

export default TermSelect;
