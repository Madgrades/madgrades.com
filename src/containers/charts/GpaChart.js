import React, { Component } from "react";
import ReactECharts from "echarts-for-react";
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

    const data = gradeDistributions.map((gradeDistribution) => ({
      gpa: utils.grades.gpa(gradeDistribution),
      termName: utils.termCodes.toName(gradeDistribution.termCode),
    }));

    const termNames = data.map((d) => d.termName);
    const gpas = data.map((d) => d.gpa);

    const isDark = theme === "dark";
    // Use explicit theme colors for text/grid; always use red for the GPA line (consistent across themes)
    const textColor = isDark ? "#ffffff" : "#222";
    const gridColor = isDark ? "#404040" : "#e6e6e6";
    const lineColor = "#ff6b6b"; // always red

    const option = {
      backgroundColor: "transparent",
      textStyle: { color: textColor },
      tooltip: {
        trigger: "axis",
        backgroundColor: isDark ? "#2d2d2d" : "#fff",
        borderColor: gridColor,
        textStyle: { color: textColor },
        formatter: (params) => {
          const p = params[0];
          return `${p.axisValue}<br/>Average GPA: ${utils.grades.formatGpa(
            p.data,
          )}`;
        },
      },
      grid: { left: 40, right: 20, bottom: 70, top: 20 },
      xAxis: {
        type: "category",
        data: termNames,
        axisLabel: { rotate: -45, color: textColor, interval: 0, fontSize: 12 },
        axisLine: { lineStyle: { color: gridColor } },
        axisTick: { lineStyle: { color: gridColor } },
        nameTextStyle: { color: textColor },
      },
      yAxis: {
        type: "value",
        min: (value) => Math.floor(Math.min(3.0, value.min)),
        max: 4.0,
        axisLine: { lineStyle: { color: gridColor } },
        axisTick: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor } },
        axisLabel: { color: textColor, fontSize: 12 },
        name: "Average GPA",
        nameLocation: "middle",
        nameGap: 45,
        nameTextStyle: { color: textColor },
      },
      series: [
        {
          data: gpas,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          color: lineColor,
          lineStyle: { color: lineColor, width: 3 },
          areaStyle: {
            color: isDark ? "rgba(255,107,107,0.08)" : "rgba(79,70,229,0.08)",
          },
          emphasis: { itemStyle: { color: lineColor } },
        },
      ],
    };

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {title && (
          <div>
            <p style={{ textAlign: "center", marginBottom: "10px" }}>{title}</p>
          </div>
        )}
        <div style={{ height: 340 }}>
          <ReactECharts
            option={option}
            opts={{ renderer: "svg" }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => ({
  theme: state.app.theme,
});

export default connect(mapStateToProps)(GpaChart);
