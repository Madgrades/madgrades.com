import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import utils from '../utils/index';

interface TermSelectProps {
  termCodes: number[];
  includeCumulative?: boolean;
  cumulativeText?: string;
  onChange?: (termCode: number) => void;
  descriptions?: { [key: number]: string };
  value?: number;
}

class TermSelect extends Component<TermSelectProps> {
  static defaultProps = {
    includeCumulative: false,
    cumulativeText: 'Cumulative',
    onChange: (termCode: number) => {},
    descriptions: {},
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

  onChange = (event: any, { value }: { value: number }) => {
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
