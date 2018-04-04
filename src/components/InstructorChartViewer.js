import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types"
import {Button, Dropdown, Form} from "semantic-ui-react";
import TermSelect from "../containers/TermSelect";
import CourseChart from "./CourseChart";
import domtoimage from "dom-to-image";
import FileSaver from "file-saver";
import {Col, Row} from "react-flexbox-grid";

class InstructorChartViewer extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    termCode: PropTypes.number,
    courseUuid: PropTypes.number,
    onChange: PropTypes.func,
  };

  state = {
    isExporting: false
  };

  static defaultProps = {
    onChange: ({termCode, courseUuid}) => {}
  };

  componentWillMount = () => {
    const { id, actions } = this.props;
    actions.fetchInstructorGrades(id);
  };

  componentDidUpdate = this.componentWillMount;

  onTermCodeChange = (termCode) => {
    const { onChange, courseUuid } = this.props;

    this.setState({
      termCode
    }, () => {
      onChange({termCode, courseUuid})
    });
  };

  onCourseChange = (event, { value }) => {
    const { onChange, termCode } = this.props;

    this.setState({
      courseUuid: value
    }, () => {
      onChange({termCode, courseUuid: value})
    });
  };

  onSaveChart = () => {
    if (this.state.isExporting)
      return;

    this.setState({
      isExporting: true
    });

    domtoimage.toBlob(this.chart, {bgcolor: "#fff"})
      .then(blob => {
        FileSaver.saveAs(blob, `madgrades-${new Date().toISOString()}.png`);
        this.setState({
          isExporting: false
        });
      })
      .catch(error => {
        this.setState({
          isExporting: false
        });
      });
  };

  render = () => {
    const { id, data, courseUuid, termCode } = this.props;
    const { isExporting } = this.state;

    let courseOptions = [],
        termCodes = [],
        termDescs = {},
        courseText = 'All courses',
        termText = 'All semesters';

    if (data && !data.isFetching) {
      courseOptions.push({
        key: 0,
        value: 0,
        text: courseText
      });
      courseOptions = courseOptions.concat(data.courses.map(c => {
        return {
          key: c.uuid,
          value: c.uuid,
          text: c.uuid,
          description: utils.grades.gpa(c.cumulative, true)
        }
      }));

      data.courseOfferings.forEach(o => {
        if (!termCodes.includes(o.termCode))
          termCodes.push(o.termCode);
        termDescs[o.termCode] = '';
      });

      // if course selected, filter term codes
      if (courseUuid) {
        let courseName = 'N/A';

        termCodes = termCodes.filter(code => {
          if (code === 0)
            return true;

          const course = data.courses.filter(i => i.uuid === courseUuid)[0];

          if (!course)
            return true;

          // courseName = course.name; TODO
          courseName = course.uuid;
          return course.terms.map(term => term.termCode).includes(code);
        });

        termText += ` (${courseName})`;
      }

      // if term code selected, filter instructor options
      if (termCode) {
        let termName = utils.termCodes.toName(termCode);
        courseText += ` (${termName})`;

        courseOptions = courseOptions.filter(option => {
          const uuid = option.value;

          if (uuid === 0)
            return true;

          const course = data.courses.filter(i => i.uuid === uuid)[0];
          return course.terms.map(term => term.termCode).includes(termCode);
        });
      }

      courseOptions[0].text = courseText;
    }

    console.log(courseOptions);

    return (
        <Row>
          <Col xs={12} md={12} lg={4}>
            <Form>
              <Form.Field>
                <label>Courses</label>
                <Dropdown
                    fluid
                    selection
                    search
                    options={courseOptions}
                    onChange={this.onCourseChange}
                    value={courseUuid}/>
              </Form.Field>
              <Form.Field>
                <label>Semesters</label>
                <TermSelect
                    value={termCode}
                    termCodes={termCodes}
                    includeCumulative={true}
                    cumulativeText={termText}
                    onChange={this.onTermCodeChange}
                    descriptions={termDescs}/>
              </Form.Field>
              <Form.Field>
                <label>Export</label>
                <Button icon='download' loading={isExporting} basic size='small' content='Save PNG' onClick={this.onSaveChart}/>
              </Form.Field>
            </Form>
            <br/>
          </Col>
          <Col xs={12} lg={8}>
            <div ref={ref => this.chart = ref}>

            </div>
          </Col>
        </Row>
    )
  }
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  const data = state.grades.instructors.data[ownProps.id];
  console.log("Gotem", data);

  return {
    data
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(InstructorChartViewer)
