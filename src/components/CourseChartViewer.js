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

class CourseChartViewer extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    termCode: PropTypes.number,
    instructorId: PropTypes.number,
    onChange: PropTypes.func,
  };

  state = {
    isExporting: false
  };

  static defaultProps = {
    onChange: ({termCode, instructorId}) => {}
  };

  componentWillMount = () => {
    const { uuid, actions } = this.props;
    actions.fetchCourseGrades(uuid);
  };

  componentDidUpdate = this.componentWillMount;

  onTermCodeChange = (termCode) => {
    const { onChange, instructorId } = this.props;

    this.setState({
      termCode
    }, () => {
      onChange({termCode, instructorId})
    });
  };

  onInstructorChange = (event, { value }) => {
    const { onChange, termCode } = this.props;

    this.setState({
      instructorId: value
    }, () => {
      onChange({termCode, instructorId: value})
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
    const { uuid, data, instructorId, termCode } = this.props;
    const { isExporting } = this.state;

    let instructorOptions = [],
        termCodes = [],
        termDescs = {},
        instructorText = 'All instructors',
        termText = 'All semesters';

    if (data && !data.isFetching) {
      instructorOptions.push({
        key: 0,
        value: 0,
        text: instructorText
      });
      instructorOptions = instructorOptions.concat(data.instructors.map(i => {
        return {
          key: i.id,
          value: i.id,
          text: i.name,
          description: utils.grades.gpa(i.cumulative, true)
        }
      }));

      data.courseOfferings.forEach(o => {
        termCodes.push(o.termCode);
        termDescs[o.termCode] = utils.grades.gpa(o.cumulative, true);
      });

      // if instructor selected, filter term codes
      if (instructorId) {
        let instructorName = 'N/A';

        termCodes = termCodes.filter(code => {
          if (code === 0)
            return true;

          const instructor = data.instructors.filter(i => i.id === instructorId)[0];

          if (!instructor)
            return true;

          instructorName = instructor.name;
          return instructor.terms.map(term => term.termCode).includes(code);
        });

        termText += ` (${instructorName})`;
      }

      // if term code selected, filter instructor options
      if (termCode) {
        let termName = utils.termCodes.toName(termCode);
        instructorText += ` (${termName})`;

        instructorOptions = instructorOptions.filter(option => {
          const id = option.value;

          if (id === 0)
            return true;

          const instructor = data.instructors.filter(i => i.id === id)[0];
          return instructor.terms.map(term => term.termCode).includes(termCode);
        });
      }

      instructorOptions[0].text = instructorText;
    }

    let instructorChosen = instructorId || undefined,
        termChosen = termCode || undefined;

    return (
        <Row>
          <Col xs={12} md={12} lg={4}>
            <Form>
              <Form.Field>
                <label>Instructors</label>
                <Dropdown
                    fluid
                    selection
                    search
                    options={instructorOptions}
                    onChange={this.onInstructorChange}
                    value={instructorId}/>
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
            <CourseChart
                uuid={uuid}
                instructorId={instructorChosen}
                termCode={termChosen}/>
            </div>
          </Col>
        </Row>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    data
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(CourseChartViewer)
