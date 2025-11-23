import { Dropdown } from 'semantic-ui-react';
import utils from '../utils/index';

interface TermSelectProps {
  termCodes: number[];
  includeCumulative?: boolean;
  cumulativeText?: string;
  onChange?: (termCode: number) => void;
  descriptions?: Record<number, string>;
  value?: number;
}

function TermSelect({
  termCodes,
  includeCumulative = false,
  cumulativeText = 'Cumulative',
  onChange = () => {
    /* no-op */
  },
  descriptions = {},
  value,
}: TermSelectProps) {
  const generateOptions = () => {
    let cumulativeOption: { key: number; value: number; text: string }[] = [];

    if (includeCumulative) {
      cumulativeOption = [{ key: 0, value: 0, text: cumulativeText }];
    }

    const termOptions = termCodes.map(code => {
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

  const handleChange = (_event: React.SyntheticEvent, { value: newValue }: { value: number }) => {
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
