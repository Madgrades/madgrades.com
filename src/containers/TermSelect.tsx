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

function TermSelect({
  termCodes,
  includeCumulative = false,
  cumulativeText = 'Cumulative',
  onChange = () => {},
  descriptions = {},
  value,
}: TermSelectProps) {
  const generateOptions = () => {
    let cumulativeOption: any[] = [];

    if (includeCumulative) {
      cumulativeOption = [{ key: 0, value: 0, text: cumulativeText }];
    }

    const termOptions = termCodes.map((code) => {
      const desc = descriptions[code];
      return {
        key: code,
        value: code,
        text: utils.termCodes.toName(code),
        description: desc,
      };
    });

    return cumulativeOption.concat(termOptions);
  };

  const handleChange = (event: any, { value: newValue }: { value: number }) => {
    onChange(newValue);
  };

  const options = generateOptions();

  return (
    <Dropdown
      fluid
      selection
      search
      value={value || options[0].value}
      options={options}
      onChange={handleChange}
    />
  );
}

export default TermSelect;
