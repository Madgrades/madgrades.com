import React, { Component } from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import utils from "../../utils";

export class GpaChart extends Component {
  static propTypes = {
    gradeDistributions: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string,
    theme: PropTypes.string,
  };

  render = () => {
    const { title, gradeDistributions, theme } = this.props;

    if (!gradeDistributions) return null;

    const data = gradeDistributions.map((gradeDistribution) => {
      return {
        gpa: utils.grades.gpa(gradeDistribution),
        termName: utils.termCodes.toName(gradeDistribution.termCode),
      };
    });

    // Theme-aware colors
    const textColor = theme === "dark" ? "#ffffff" : "#000000";
    const gridColor = theme === "dark" ? "#404040" : "#ccc";
    const lineColor = theme === "dark" ? "#c5050c" : "#8884d8";

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {title && (
          <div>
            <p style={{ textAlign: "center", marginBottom: "10px" }}>{title}</p>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" aspect={16.0 / 9.0}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: -15, bottom: 50 }}
            >
              <CartesianGrid stroke={gridColor} />
              <XAxis
                dataKey="termName"
                interval={0}
                angle={-45}
                textAnchor="end"
                type="category"
                tick={{ fill: textColor }}
              />
              <YAxis
                domain={[(min) => Math.floor(Math.min(3.0, min)), (max) => 4.0]}
                tick={{ fill: textColor }}
              >
                <Label
                  value="Average GPA"
                  position="insideLeft"
                  dx={15}
                  dy={25}
                  angle={-90}
                  fill={textColor}
                />
              </YAxis>
              <Line
                type="monotone"
                dataKey="gpa"
                isAnimationActive={false}
                stroke={lineColor}
              />
              <Tooltip
                formatter={(gpa) => utils.grades.formatGpa(gpa)}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#2d2d2d" : "#fff",
                  borderColor: gridColor,
                }}
                labelStyle={{ color: textColor }}
                itemStyle={{ color: textColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => ({
  theme: state.app.theme,
});

export default connect(mapStateToProps)(GpaChart);
