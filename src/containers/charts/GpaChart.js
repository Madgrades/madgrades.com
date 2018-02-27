import React, {Component} from "react";
import {
  CartesianGrid,
  Label, Legend,
  Line,
  LineChart,
  ResponsiveContainer, Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PropTypes from "prop-types";
import utils from "../../utils";

const CustomizedAxisTick = (props) => {
  const {x, y, stroke, payload} = props;

  return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
      </g>
  );
};

export class GpaChart extends Component {
  static propTypes = {
    gradeDistributions: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render = () => {
    const { gradeDistributions } = this.props;

    if (!gradeDistributions)
      return null;

    const data = gradeDistributions.map(gradeDistribution => {
      return {
        gpa: gradeDistribution.gpa,
        term: utils.termCodes.toName(gradeDistribution.termCode)
      }
    });

    return (
        <ResponsiveContainer minWidth={200} minHeight={100}>
          <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
            <CartesianGrid stroke="#ccc"/>
            <XAxis dataKey="term" interval={0} angle={-45} textAnchor="end" type="category"/>
            <YAxis domain={[min => Math.floor(Math.min(3.0, min)), max => 4.0]}>
              <Label value="GPA" position="insideLeft" angle={-90}/>
            </YAxis>
            <Line type="monotone" dataKey="gpa" isAnimationActive={false}/>
            <Tooltip/>
          </LineChart>
        </ResponsiveContainer>
    );
  }
}