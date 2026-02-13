import React, { Component } from "react";
import ReactECharts from "echarts-for-react";
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

    const rows = utils.grades.getGradeKeys(false).map((key) => {
      const name = utils.grades.keyToName(key);

      let percent = 0;
      let count = 0;
      let percentSecondary = null;
      let countSecondary = null;

      if (primary) {
        count = primary[key] || 0;
        const outOf = primary.total || 1;
        percent = (count / outOf) * 100;
      }

      if (secondary) {
        countSecondary = secondary[key] || 0;
        const outOf = secondary.total || 1;
        percentSecondary = (countSecondary / outOf) * 100;
      }

      return { name, percent, count, percentSecondary, countSecondary };
    });

    const categories = rows.map((r) => r.name);
    const primaryValues = rows.map((r) => r.percent);
    const secondaryValues = rows.map((r) =>
      r.percentSecondary == null ? 0 : r.percentSecondary,
    );
    const primaryLabels = rows.map(
      (r) => `${r.percent.toFixed(1)}%\n${utils.numberWithCommas(r.count)}`,
    );
    const secondaryLabels = rows.map(
      (r) =>
        `${r.countSecondary != null ? r.percentSecondary.toFixed(1) : 0}%\n${utils.numberWithCommas(r.countSecondary || 0)}`,
    );

    const isDark = theme === "dark";
    const textColor = isDark ? "#ffffff" : "#000000";
    const gridColor = isDark ? "#303030" : "#f0f0f0";
    const primaryBarColor = isDark ? "#888888" : "#282728";

    const option = {
      backgroundColor: "transparent",
      textStyle: { color: textColor },
      // disable tooltip — labels are shown directly on bars
      tooltip: { show: false },
      // reduce category gap so A/B/BC labels are closer together
      barCategoryGap: "10%",
      grid: { left: 20, right: 20, bottom: 60, top: 40 },
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { color: textColor, interval: 0, rotate: 0, fontSize: 12 },
        axisLine: { lineStyle: { color: isDark ? "#333" : "#ddd" } },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 10,               // show tick/label every 10
        axisTick: { lineStyle: { color: gridColor }, show: true },
        axisLabel: { color: textColor },
        splitLine: { lineStyle: { color: gridColor } },
        name: "Students (%)",
        nameLocation: "middle",
        nameGap: 45,
        nameTextStyle: { color: textColor },
      },
      legend: { textStyle: { color: textColor } },
      series: [
        {
          name: primaryLabel,
          type: "bar",
          data: primaryValues,
          itemStyle: { color: primaryBarColor },
          // make single-series bars thicker
          barWidth: "48%",
          // disable hover emphasis to remove hover effect
          emphasis: { focus: "none", itemStyle: { opacity: 1 } },
          label: {
            show: true,
            position: "top",
            // use rich text for two-line styling: bold percentage on top, smaller count below
            textBorderColor: "transparent",
            textBorderWidth: 0,
            formatter: function (params) {
              const txt = primaryLabels[params.dataIndex] || "";
              const parts = txt.split("\n");
              const pct = parts[0] || "";
              const cnt = parts[1] || "";
              return `{pct|${pct}}\n{cnt|${cnt}}`;
            },
            rich: {
              pct: { fontSize: 10, fontWeight: "700", color: textColor },
              cnt: {
                fontSize: 8,
                color: textColor,
                opacity: 0.85,
                padding: [2, 0, 0, 0],
              },
            },
          },
        },
      ],
    };

    if (secondary) {
      option.series.push({
        name: secondaryLabel,
        type: "bar",
        data: secondaryValues,
        itemStyle: { color: "#c5050c" },
        // disable hover emphasis on secondary series as well
        emphasis: { focus: "none", itemStyle: { opacity: 1 } },
        label: {
          show: true,
          position: "top",
          textBorderColor: "transparent",
          textBorderWidth: 0,
          formatter: function (params) {
            const txt = secondaryLabels[params.dataIndex] || "";
            const parts = txt.split("\n");
            const pct = parts[0] || "";
            const cnt = parts[1] || "";
            return `{pct|${pct}}\n{cnt|${cnt}}`;
          },
          rich: {
            pct: { fontSize: 10, fontWeight: "700", color: textColor },
            cnt: {
              fontSize: 8,
              color: textColor,
              opacity: 0.85,
              padding: [2, 0, 0, 0],
            },
          },
        },
      });

      // increase spacing between bars when comparing (secondary present)
      option.series[0].barGap = "20%"; // gap between series in a category (smaller than before)
      option.series[0].barWidth = "36%"; // thicker than before
      option.series[1].barWidth = "36%";
    }

    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {title && (
          <div>
            <p style={{ textAlign: "center" }}>{title}</p>
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

export default connect(mapStateToProps)(GradeDistributionChart);
