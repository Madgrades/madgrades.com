import React, { Component } from "react";
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import utils from "../../utils";

class GradeDistributionChart extends Component {
  static propTypes = {
    title: PropTypes.string,
    primary: PropTypes.object,
    primaryLabel: PropTypes.string,
    secondary: PropTypes.object,
    secondaryLabel: PropTypes.string,
    theme: PropTypes.string,
  };

  static defaultProps = {
    title: "Grade Distribution",
    primary: utils.grades.zero(),
    secondaryLabel: "Secondary",
  };

  renderBarLabel = (props) => {
    const { x, y, width, value } = props;
    const textColor = this.props.theme === "dark" ? "#ffffff" : "#000000";

    return (
      <text textAnchor="middle" dominantBaseline="middle" fill={textColor}>
        <tspan x={x + width / 2} y={y - 24} fontSize="80%" fontWeight="bold">
          {value.split("\n")[0]}
        </tspan>
        <tspan x={x + width / 2} y={y - 10} fontSize="70%">
          {value.split("\n")[1]}
        </tspan>
      </text>
    );
  };

  render = () => {
    const { title, primary, secondary, theme } = this.props;
    let { primaryLabel, secondaryLabel } = this.props;

    if (!primaryLabel) {
      if (secondary) {
        primaryLabel = "Primary";
      } else {
        primaryLabel = "Grades Received";
      }
    }

    const data = utils.grades.getGradeKeys(false).map((key) => {
      const name = utils.grades.keyToName(key);

      let percent, label, percentSecondary, labelSecondary;

      if (primary) {
        const gradeCount = primary[key];
        const outOf = primary.total || 1; // we don't want to divide by 0
        percent = (gradeCount / outOf) * 100;
        label = percent.toFixed(1) + "%\n" + utils.numberWithCommas(gradeCount);
      }

      if (secondary) {
        const gradeCount = secondary[key];
        const outOf = secondary.total || 1; // we don't want to divide by 0
        percentSecondary = (gradeCount / outOf) * 100;
        labelSecondary =
          percentSecondary.toFixed(1) +
          "%\n" +
          utils.numberWithCommas(gradeCount);
      }

      return {
        name,
        percent,
        label,
        percentSecondary,
        labelSecondary,
      };
    });

    // Theme-aware colors
    const textColor = theme === "dark" ? "#ffffff" : "#000000";
    const primaryBarColor = theme === "dark" ? "#888888" : "#282728";

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <p style={{ textAlign: "center" }}>{title}</p>
        </div>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" aspect={16.0 / 9.0}>
            <BarChart
              data={data}
              margin={{ top: 35, right: 5, left: 0, bottom: 20 }}
            >
              <XAxis dataKey="name" tick={{ fill: textColor }}></XAxis>
              <YAxis
                domain={[0, 100]}
                tickCount={11}
                tick={{ fill: textColor }}
              >
                <Label
                  value="Students (%)"
                  position="insideLeft"
                  dx={15}
                  dy={30}
                  angle={-90}
                  fill={textColor}
                />
              </YAxis>
              <Bar
                name={primaryLabel}
                dataKey="percent"
                isAnimationActive={false}
                fill={primaryBarColor}
              >
                <LabelList
                  dataKey="label"
                  content={this.renderBarLabel}
                  position="top"
                />
              </Bar>
              {secondary && (
                <Bar
                  name={secondaryLabel}
                  dataKey="percentSecondary"
                  isAnimationActive={false}
                  fill="#c5050c"
                >
                  <LabelList
                    dataKey="labelSecondary"
                    content={this.renderBarLabel}
                    position="top"
                  />
                </Bar>
              )}
              <Legend wrapperStyle={{ color: textColor }} iconType="circle" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => ({
  theme: state.app.theme,
});

export default connect(mapStateToProps)(GradeDistributionChart);
