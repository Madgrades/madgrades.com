import React, { Component } from 'react';
import { Dropdown, DropdownProps } from 'semantic-ui-react';
import utils from '../utils/index';

interface TermSelectProps {
  termCodes: number[];
  includeCumulative?: boolean;
  cumulativeText?: string;
  onChange?: (termCode: number) => void;
  descriptions?: Record<number, string>;
  value?: number;
}

interface TermOption {
  key: number;
  value: number;
  text: string;
  description?: string;
}

class TermSelect extends Component<TermSelectProps> {
  static defaultProps = {
    includeCumulative: false,
    cumulativeText: 'Cumulative',
    onChange: (_termCode: number): void => {},
    descriptions: {}
  };

  generateOptions = (): TermOption[] => {
    const { includeCumulative, cumulativeText, descriptions } = this.props;
    let cumulativeOption: TermOption[] = [];

    if (includeCumulative) {
      cumulativeOption = [
        { key: 0, value: 0, text: cumulativeText! }
      ];
    }

    const termOptions = this.props.termCodes.map(code => {
      const desc = descriptions![code];
      return {
        key: code,
        value: code,
        text: utils.termCodes.toName(code),
        description: desc
      };
    });

    return cumulativeOption.concat(termOptions);
  };

  onChange = (_event: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void => {
    this.props.onChange!(value as number);
  };

  render = (): JSX.Element => {
    const { value } = this.props;
    const options = this.generateOptions();

    return (
      <Dropdown
        fluid
        selection
        search
        value={value || options[0].value}
        options={options}
        onChange={this.onChange}
      />
    );
  };
}

export default TermSelect;
