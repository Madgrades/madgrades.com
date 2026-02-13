import React, { Component } from "react";
import ReactECharts from "echarts-for-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import utils from "../../utils";

export class GpaChart extends Component {
  static propTypes = {
    // legacy single-series usage
    gradeDistributions: PropTypes.arrayOf(PropTypes.object),
    // new multi-series usage (arrays of gradeDistribution objects)
    primary: PropTypes.arrayOf(PropTypes.object),
    secondary: PropTypes.arrayOf(PropTypes.object),
    // optional labels when using primary/secondary
    primaryLabel: PropTypes.string,
    secondaryLabel: PropTypes.string,
    title: PropTypes.string,
    theme: PropTypes.string,
  };

  // convert gradeDistribution array -> [{ termCode, termName, gpa }]
  normalize = (arr) => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr
      .map((gd) => ({
        termCode: gd.termCode || 0,
        termName: utils.termCodes.toName(gd.termCode),
        gpa: utils.grades.gpa(gd),
      }))
      .sort((a, b) => a.termCode - b.termCode);
  };

  // merge two normalized series by termName (union of terms, sorted by termCode)
  mergeSeries = (primaryNorm, secondaryNorm) => {
    const map = {};

    primaryNorm.forEach((p) => {
      map[p.termCode] = {
        termCode: p.termCode,
        termName: p.termName,
        primary: p.gpa,
        secondary: null,
      };
    });

    secondaryNorm.forEach((s) => {
      if (map[s.termCode]) {
        map[s.termCode].secondary = s.gpa;
      } else {
        map[s.termCode] = {
          termCode: s.termCode,
          termName: s.termName,
          primary: null,
          secondary: s.gpa,
        };
      }
    });

    const merged = Object.keys(map)
      .map((k) => map[k])
      .sort((a, b) => a.termCode - b.termCode);

    const termNames = merged.map((m) => m.termName);
    const primaryGpas = merged.map((m) =>
      m.primary == null ? null : m.primary,
    );
    const secondaryGpas = merged.map((m) =>
      m.secondary == null ? null : m.secondary,
    );

    return { termNames, primaryGpas, secondaryGpas };
  };

  render = () => {
    const { title, gradeDistributions, theme } = this.props;

    const isMulti = Array.isArray(this.props.primary);

    const isDark = theme === "dark";
    const textColor = isDark ? "#ffffff" : "#222";
    const gridColor = isDark ? "#404040" : "#e6e6e6";

    // give extra bottom spacing when rendering multi-series so legend doesn't overlap x-axis labels
    const gridBottom = isMulti ? 100 : 70;

    let option = {
      backgroundColor: "transparent",
      textStyle: { color: textColor },
      tooltip: {
        trigger: "axis",
        backgroundColor: isDark ? "#2d2d2d" : "#fff",
        borderColor: gridColor,
        textStyle: { color: textColor },
      },
      grid: { left: 40, right: 20, bottom: gridBottom, top: 20 },
      xAxis: {
        type: "category",
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
      series: [],
    };

    if (isMulti) {
      // multi-series rendering (primary + secondary arrays)
      const primaryNorm = this.normalize(this.props.primary);
      const secondaryNorm = this.normalize(this.props.secondary || []);
      const merged = this.mergeSeries(primaryNorm, secondaryNorm);

      option.xAxis.data = merged.termNames;
      option.legend = { textStyle: { color: textColor }, bottom: 10 };

      const primaryColor = "#4f46e5"; // indigo - primary
      const secondaryColor = "#ff6b6b"; // red - secondary (consistent)

      option.tooltip.formatter = (params) => {
        // params may contain multiple series; build a readable tooltip
        const parts = params.map((p) => {
          const value = p.data;
          const formatted =
            value == null || isNaN(value)
              ? "N/A"
              : utils.grades.formatGpa(value);
          return `${p.marker} ${p.seriesName}: ${formatted}`;
        });
        return `${params[0].axisValue}<br/>${parts.join("<br/>")}`;
      };

      option.series.push(
        {
          name: this.props.primaryLabel || "Primary",
          data: merged.primaryGpas,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          color: primaryColor,
          lineStyle: { color: primaryColor, width: 3 },
          areaStyle: {
            color: isDark ? "rgba(79,70,229,0.08)" : "rgba(79,70,229,0.08)",
          },
          emphasis: { itemStyle: { color: primaryColor } },
        },
        {
          name: this.props.secondaryLabel || "Secondary",
          data: merged.secondaryGpas,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          color: secondaryColor,
          lineStyle: { color: secondaryColor, width: 3 },
          areaStyle: {
            color: isDark ? "rgba(255,107,107,0.08)" : "rgba(255,107,107,0.08)",
          },
          emphasis: { itemStyle: { color: secondaryColor } },
        },
      );
    } else {
      // legacy single-series rendering
      if (!gradeDistributions) return null;

      const data = gradeDistributions.map((gradeDistribution) => ({
        gpa: utils.grades.gpa(gradeDistribution),
        termName: utils.termCodes.toName(gradeDistribution.termCode),
        termCode: gradeDistribution.termCode,
      }));

      data.sort((a, b) => a.termCode - b.termCode);

      const termNames = data.map((d) => d.termName);
      const gpas = data.map((d) => d.gpa);

      const lineColor = "#ff6b6b"; // keep backward-compatible color

      option.xAxis.data = termNames;
      option.tooltip.formatter = (params) => {
        const p = params[0];
        const value = p.data;
        const formatted =
          value == null || isNaN(value) ? "N/A" : utils.grades.formatGpa(value);
        return `${p.axisValue}<br/>Average GPA: ${formatted}`;
      };

      option.series.push({
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
      });
    }

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
