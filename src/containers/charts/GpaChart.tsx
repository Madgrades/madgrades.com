import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import utils from '../../utils';
import { CourseOffering } from '../../types';

interface GpaChartProps {
  gradeDistributions: CourseOffering[];
  title?: string;
}

export function GpaChart({ title, gradeDistributions }: GpaChartProps) {
  const data = gradeDistributions.map(gradeDistribution => {
    return {
      gpa: utils.grades.gpa(gradeDistribution),
      termName: utils.termCodes.toName(gradeDistribution.termCode),
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {title && (
        <div>
          <p style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</p>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" aspect={16.0 / 9.0}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: -15, bottom: 50 }}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="termName" interval={0} angle={-45} textAnchor="end" type="category" />
            <YAxis domain={[(min: number) => Math.floor(Math.min(3.0, min)), () => 4.0]}>
              <Label value="Average GPA" position="insideLeft" dx={15} dy={25} angle={-90} />
            </YAxis>
            <Line type="monotone" dataKey="gpa" isAnimationActive={false} />
            <Tooltip formatter={gpa => utils.grades.formatGpa(Number(gpa))} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GpaChart;
