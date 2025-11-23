import {
  Bar,
  BarChart,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import utils from '../../utils';
import { GradeDistribution } from '../../types';

interface BarLabelProps {
  x: number;
  y: number;
  width: number;
  value: string;
}

const renderBarLabel = (props: BarLabelProps) => {
  const { x, y, width, value } = props;

  const parts = value.split('\n');
  return (
    <text textAnchor="middle" dominantBaseline="middle">
      <tspan x={x + width / 2} y={y - 24} fontSize="80%" fontWeight="bold">
        {parts[0]}
      </tspan>
      <tspan x={x + width / 2} y={y - 10} fontSize="70%">
        {parts[1]}
      </tspan>
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

function GradeDistributionChart({
  title = 'Grade Distribution',
  primary = utils.grades.zero(),
  primaryLabel,
  secondary,
  secondaryLabel = 'Secondary',
}: GradeDistributionChartProps) {
  let finalPrimaryLabel = primaryLabel;

  if (!finalPrimaryLabel) {
    if (secondary) {
      finalPrimaryLabel = 'Primary';
    } else {
      finalPrimaryLabel = 'Grades Received';
    }
  }

  const data = utils.grades.getGradeKeys(false).map(key => {
    const name = utils.grades.keyToName(key);

    let percentSecondary, labelSecondary;

    const gradeCount = primary[key];
    const outOf = primary.total ?? 1; // we don't want to divide by 0
    const percent = (gradeCount / outOf) * 100;
    const label = `${percent.toFixed(1)}%\n${utils.numberWithCommas(gradeCount)}`;

    if (secondary) {
      const gradeCount = secondary[key];
      const outOf = secondary.total ?? 1; // we don't want to divide by 0
      percentSecondary = (gradeCount / outOf) * 100;
      labelSecondary = `${percentSecondary.toFixed(1)}%\n${utils.numberWithCommas(gradeCount)}`;
    }

    return {
      name,
      percent,
      label,
      percentSecondary,
      labelSecondary,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        <p style={{ textAlign: 'center' }}>{title}</p>
      </div>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" aspect={16.0 / 9.0}>
          <BarChart data={data} margin={{ top: 35, right: 5, left: 0, bottom: 20 }}>
            <XAxis dataKey="name"></XAxis>
            <YAxis domain={[0, 100]} tickCount={11}>
              <Label value="Students (%)" position="insideLeft" dx={15} dy={30} angle={-90} />
            </YAxis>
            <Bar
              name={finalPrimaryLabel}
              dataKey="percent"
              isAnimationActive={false}
              fill="#282728"
            >
              <LabelList dataKey="label" content={renderBarLabel} position="top" />
            </Bar>
            {secondary && (
              <Bar
                name={secondaryLabel}
                dataKey="percentSecondary"
                isAnimationActive={false}
                fill="#c5050c"
              >
                <LabelList dataKey="labelSecondary" content={renderBarLabel} position="top" />
              </Bar>
            )}
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GradeDistributionChart;
