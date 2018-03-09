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
import utils from "../../utils";

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

    const total = gradeDistribution.total;
    const data = utils.grades.getGradeKeys(false).map(key => {
      const name = utils.grades.keyToName(key);
      const gradeCount = gradeDistribution[key];
      const outOf = total || 1; // we don't want to divide by 0
      const percent = (gradeCount / outOf) * 100;
      const label = utils.numberWithCommas(gradeCount);

      return {
        name,
        percent,
        label
      }
    });

    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column"}}>
          <div>
            <p style={{textAlign: "center"}}>
              {title}
            </p>
          </div>
          <div style={{flex: 1}}>
            <ResponsiveContainer minWidth={200} minHeight={200}>
              <BarChart data={data} margin={{ top: 15, right: 5, left: -15, bottom: 20 }}>
                <XAxis dataKey="name">
                  <Label value={`Grades Received (${utils.numberWithCommas(total)})`} position="insideBottom" offset={-10}/>
                </XAxis>
                <YAxis domain={[0, 100]} tickCount={11}>
                  <Label value="Students (%)" position="insideLeft" dx={15} dy={30} angle={-90}/>
                </YAxis>
                <Bar dataKey="percent" isAnimationActive={false} fill="rgba(0, 0, 0, 1)">
                  <LabelList dataKey="label" content={renderBarLabel} position="top"/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
    );
  }
}

export default GradeDistributionChart;