import React from 'react';
import { useMemo } from 'react';
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

const TermSelect: React.FC<TermSelectProps> = ({
  termCodes,
  includeCumulative = false,
  cumulativeText = 'Cumulative',
  onChange = (_termCode: number): void => {},
  descriptions = {},
  value
}) => {
  const options = useMemo((): TermOption[] => {
    let cumulativeOption: TermOption[] = [];

    if (includeCumulative) {
      cumulativeOption = [
        { key: 0, value: 0, text: cumulativeText }
      ];
    }

    const termOptions = termCodes.map(code => {
      const desc = descriptions[code];
      return {
        key: code,
        value: code,
        text: utils.termCodes.toName(code),
        description: desc
      };
    });

    return cumulativeOption.concat(termOptions);
  }, [termCodes, includeCumulative, cumulativeText, descriptions]);

  const handleChange = (_event: React.SyntheticEvent<HTMLElement>, { value: newValue }: DropdownProps): void => {
    onChange(newValue as number);
  };

  return (
    <Dropdown
      fluid
      selection
      search
      value={value !== undefined ? value : options[0]?.value}
      options={options}
      onChange={handleChange}
    />
  );
};

export default TermSelect;
