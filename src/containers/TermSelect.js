import React, {Component} from "react";
import PropTypes from "prop-types";
import {Dropdown} from "semantic-ui-react";
import utils from "../utils/index";

class TermSelect extends Component {
  static propTypes = {
    termCodes: PropTypes.arrayOf(PropTypes.number).isRequired,
    includeCumulative: PropTypes.bool,
    cumulativeText: PropTypes.string,
    onChange: PropTypes.func,
    descriptions: PropTypes.object,
    value: PropTypes.number
  };

  static defaultProps = {
    includeCumulative: false,
    cumulativeText: "Cumulative",
    onChange: (termCode) => {},
    descriptions: {}
  };

  generateOptions = () => {
    const { includeCumulative, cumulativeText, descriptions } = this.props;
    let cumulativeOption = [];

    if (includeCumulative) {
      cumulativeOption = [
        {key: 0, value: 0, text: cumulativeText}
      ];
    }

    const termOptions = this.props.termCodes.map(code => {
      const desc = descriptions[code];
      return {
        key: code,
        value: code,
        text: utils.termCodes.toName(code),
        description: desc
      }
    });

    return cumulativeOption.concat(termOptions);
  };

  onChange = (event, { value }) => {
    this.props.onChange(value);
  };

  render = () => {
    const { value } = this.props;
    const options = this.generateOptions();

    return (
        <Dropdown
            fluid
            selection
            search
            value={value || options[0].value}
            options={options}
            onChange={this.onChange}/>
    )
  }
}

export default TermSelect;
