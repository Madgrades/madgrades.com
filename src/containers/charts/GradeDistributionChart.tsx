import React from 'react';
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
import utils from '../../utils';
import { GradeDistribution } from '../../types/api';

interface BarLabelProps {
  x?: string | number;
  y?: string | number;
  width?: string | number;
  value?: string | number;
}

const renderBarLabel = (props: BarLabelProps) => {
  const { x, y, width, value } = props;
  const xNum = typeof x === 'number' ? x : parseFloat(String(x || 0));
  const yNum = typeof y === 'number' ? y : parseFloat(String(y || 0));
  const widthNum = typeof width === 'number' ? width : parseFloat(String(width || 0));
  const valueStr = String(value || '');

  return (
    <text textAnchor='middle' dominantBaseline='middle'>
      <tspan x={xNum + widthNum / 2} y={yNum - 24} fontSize='80%' fontWeight='bold'>{valueStr.split('\n')[0]}</tspan>
      <tspan x={xNum + widthNum / 2} y={yNum - 10} fontSize='70%'>{valueStr.split('\n')[1]}</tspan>
    </text>
  );
};

interface GradeDistributionChartProps {
  title?: string;
  primary?: GradeDistribution;
  primaryLabel?: string;
  secondary?: GradeDistribution;
  secondaryLabel?: string;
}

interface ChartDataPoint {
  name: string;
  percent?: number;
  label?: string;
  percentSecondary?: number;
  labelSecondary?: string;
}

const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({
  title = 'Grade Distribution',
  primary = utils.grades.zero(),
  secondary,
  primaryLabel: propPrimaryLabel,
  secondaryLabel = 'Secondary'
}) => {
  let primaryLabel = propPrimaryLabel;

  if (!primaryLabel) {
    if (secondary) {
      primaryLabel = 'Primary';
    }
    else {
      primaryLabel = 'Grades Received';
    }
  }

  const data: ChartDataPoint[] = utils.grades.getGradeKeys(false).map(key => {
    const name = utils.grades.keyToName(key);

    let percent: number | undefined, label: string | undefined, percentSecondary: number | undefined, labelSecondary: string | undefined;

    if (primary) {
      const gradeCount = primary[key] || 0;
      const outOf = primary.total || 1;
      percent = (gradeCount / outOf) * 100;
      label = percent.toFixed(1) + '%\n' + utils.numberWithCommas(gradeCount);
    }

    if (secondary) {
      const gradeCount = secondary[key] || 0;
      const outOf = secondary.total || 1;
      percentSecondary = (gradeCount / outOf) * 100;
      labelSecondary = percentSecondary.toFixed(1) + '%\n' + utils.numberWithCommas(gradeCount);
    }

    return {
      name,
      percent,
      label,
      percentSecondary,
      labelSecondary
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <p style={{ textAlign: 'center' }}>
          {title}
        </p>
      </div>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width='100%' aspect={16.0 / 9.0}>
          <BarChart data={data} margin={{ top: 35, right: 5, left: 0, bottom: 20 }}>
            <XAxis dataKey='name'>
            </XAxis>
            <YAxis domain={[0, 100]} tickCount={11}>
              <Label value='Students (%)' position='insideLeft' dx={15} dy={30} angle={-90} />
            </YAxis>
            <Bar name={primaryLabel} dataKey='percent' isAnimationActive={false} fill='#282728'>
              <LabelList dataKey='label' content={renderBarLabel} position='top' />
            </Bar>
            {secondary &&
              <Bar name={secondaryLabel} dataKey='percentSecondary' isAnimationActive={false} fill='#c5050c'>
                <LabelList dataKey='labelSecondary' content={renderBarLabel} position='top' />
              </Bar>
            }
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GradeDistributionChart;
