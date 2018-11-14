import React, {Component} from 'react';
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import PropTypes from 'prop-types';
import utils from '../../utils';

const renderBarLabel = (props) => {
  const { x, y, width, value } = props;

  return (
      <text x={x + width / 2} y={y - 10} textAnchor='middle' dominantBaseline='middle' fontSize='75%'>
        {value}
      </text>
  )
};

class GradeDistributionChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    primary: PropTypes.object,
    primaryLabel: PropTypes.string,
    secondary: PropTypes.object,
    secondaryLabel: PropTypes.string
  };

  static defaultProps = {
    title: 'Grade Distribution',
    primary: utils.grades.zero(),
    secondaryLabel: 'Secondary'
  };

  render = () => {
    const { title, primary, secondary } = this.props;
    let { primaryLabel, secondaryLabel } = this.props;

    if (!primaryLabel) {
      if (secondary) {
        primaryLabel = 'Primary';
      }
      else {
        primaryLabel = 'Grades Received';
      }
    }

    const data = utils.grades.getGradeKeys(false).map(key => {
      const name = utils.grades.keyToName(key);

      let percent, label, percentSecondary, labelSecondary;

      if (primary) {
        const gradeCount = primary[key];
        const outOf = primary.total || 1; // we don't want to divide by 0
        percent = (gradeCount / outOf) * 100;
        label = utils.numberWithCommas(gradeCount);
      }

      if (secondary) {
        const gradeCount = secondary[key];
        const outOf = secondary.total || 1; // we don't want to divide by 0
        percentSecondary = (gradeCount / outOf) * 100;
        labelSecondary = utils.numberWithCommas(gradeCount);
      }

      return {
        name,
        percent,
        label,
        percentSecondary,
        labelSecondary
      }
    });

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <div>
            <p style={{textAlign: 'center'}}>
              {title}
            </p>
          </div>
          <div style={{flex: 1}}>
            <ResponsiveContainer width='100%' aspect={16.0/9.0}>
              <BarChart data={data} margin={{ top: 35, right: 5, left: 0, bottom: 20 }}>
                <XAxis dataKey='name'>
                </XAxis>
                <YAxis domain={[0, 100]} tickCount={11}>
                  <Label value='Students (%)' position='insideLeft' dx={15} dy={30} angle={-90}/>
                </YAxis>
                <Bar name={primaryLabel} dataKey='percent' isAnimationActive={false} fill='#282728'>
                  <LabelList dataKey='label' content={renderBarLabel} position='top'/>
                </Bar>
                {secondary &&
                  <Bar name={secondaryLabel} dataKey='percentSecondary' isAnimationActive={false} fill='#c5050c'>
                    <LabelList dataKey='labelSecondary' content={renderBarLabel} position='top'/>
                  </Bar>
                }
                <Legend/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    );
  }
}

export default GradeDistributionChart;