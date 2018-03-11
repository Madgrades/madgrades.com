import React, {Component} from "react";
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PropTypes from "prop-types";
import utils from "../../utils";

export class GpaChart extends Component {
  static propTypes = {
    gradeDistributions: PropTypes.arrayOf(PropTypes.object).isRequired,
    title: PropTypes.string
  };

  render = () => {
    const { title, gradeDistributions } = this.props;

    if (!gradeDistributions)
      return null;

    const data = gradeDistributions.map(gradeDistribution => {
      return {
        gpa: utils.grades.gpa(gradeDistribution),
        termName: utils.termCodes.toName(gradeDistribution.termCode)
      }
    });

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
          <div>
            <p style={{textAlign: "center"}}>
              {title}
            </p>
          </div>
          <div style={{flex: 1}}>
            <ResponsiveContainer width='100%' aspect={16.0/9.0}>
              <LineChart data={data} margin={{ top: 20, right: 20, left: -15, bottom: 50 }}>
                <CartesianGrid stroke="#ccc"/>
                <XAxis dataKey="termName" interval={0} angle={-45} textAnchor="end" type="category"/>
                <YAxis domain={[min => Math.floor(Math.min(3.0, min)), max => 4.0]}>
                  <Label value="Average GPA" position="insideLeft" dx={15} dy={25} angle={-90}/>
                </YAxis>
                <Line type="monotone" dataKey="gpa" isAnimationActive={false}/>
                <Tooltip formatter={gpa => gpa.toFixed(2)}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
    );
  }
}