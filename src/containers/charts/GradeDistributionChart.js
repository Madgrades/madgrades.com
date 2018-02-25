import React, {Component} from "react";
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import PropTypes from "prop-types";
import * as gradeDistributions from "../../util/gradeDistributions";

const renderBarLabel = (props) => {
  const { x, y, width, value } = props;

  return (
      <text x={x + width / 2} y={y - 10} textAnchor="middle" dominantBaseline="middle" fontSize="75%">
        {value}
      </text>
  )
};

class GradeDistributionChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    gradeDistribution: PropTypes.object.isRequired
  };

  render = () => {
    const { title, gradeDistribution } = this.props;

    if (!gradeDistribution)
      return null;

    const totalCount = gradeDistribution.count;

    const data = gradeDistributions.getGradeKeys(false).map(key => {
      const name = gradeDistributions.keyToName(key);
      const gradeCount = gradeDistribution[key];
      const outOf = totalCount || 1; // we don't want to divide by 0
      const percent = (gradeCount / outOf) * 100;
      const label = percent.toFixed(1) + "% (" + gradeCount + ")";

      return {
        name,
        percent,
        label
      }
    });

    return (
        <div style={{width: "100%", height: "100%"}}>
          <h2 style={{textAlign: "center"}}>
            {title}
          </h2>
          <ResponsiveContainer minWidth={200} minHeight={100}>
            <BarChart data={data}>
              <XAxis dataKey="name">
                <Label value="Grades Received" position="insideBottom" offset={-5}/>
              </XAxis>
              <YAxis domain={[0, 100]} tickCount={11}>
                <Label value="Counts (%)" position="insideLeft" dy={15} angle={-90}/>
              </YAxis>
              <Bar dataKey="percent" isAnimationActive={false} fill="rgba(0, 0, 0, 1)">
                <LabelList dataKey="label" content={renderBarLabel} position="top"/>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
    );
  }
}

export default GradeDistributionChart;