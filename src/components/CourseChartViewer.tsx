import React, { Component } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCourseGrades } from "../store/slices/gradesSlice";
import utils from "../utils";
import { Button, Dropdown, DropdownProps, Form } from "semantic-ui-react";
import { Row, Col } from "./Grid";
import TermSelect from "../containers/TermSelect";
import CourseChart from "./CourseChart";
import domtoimage from "dom-to-image";
import FileSaver from "file-saver";
import { CourseGradesResponse } from "../types/api";

interface ChangeParams {
  termCode?: number;
  instructorId?: number;
}

interface CourseChartViewerProps {
  uuid: string;
  termCode?: number;
  instructorId?: number;
  onChange?: (params: ChangeParams) => void;
}

interface InstructorOption {
  key: number;
  value: number;
  text: string;
  description?: string | number;
}

interface CourseChartViewerClassProps extends CourseChartViewerProps {
  data?: CourseGradesResponse & { isFetching: boolean };
  dispatch: ReturnType<typeof useAppDispatch>;
}

interface CourseChartViewerState {
  isExporting: boolean;
}

class CourseChartViewerClass extends Component<CourseChartViewerClassProps, CourseChartViewerState> {
  private chart: HTMLDivElement | null = null;

  static defaultProps = {
    onChange: (_params: ChangeParams): void => {},
  };

  state: CourseChartViewerState = {
    isExporting: false,
  };

  fetchCourseGrades = (): void => {
    const { uuid, dispatch } = this.props;
    dispatch(fetchCourseGrades(uuid));
  };

  componentDidMount = (): void => {
    this.fetchCourseGrades();
  };

  componentDidUpdate = (prevProps: CourseChartViewerClassProps): void => {
    if (prevProps.uuid !== this.props.uuid) {
      this.fetchCourseGrades();
    }
  };

  onTermCodeChange = (termCode: number): void => {
    const { onChange, instructorId } = this.props;

    this.setState(
      {
        termCode,
      } as never,
      () => {
        onChange!({ termCode, instructorId });
      }
    );
  };

  onInstructorChange = (_event: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void => {
    const { onChange, termCode } = this.props;

    this.setState(
      {
        instructorId: value,
      } as never,
      () => {
        onChange!({ termCode, instructorId: value as number });
      }
    );
  };

  onSaveChart = (): void => {
    if (this.state.isExporting || !this.chart) return;

    this.setState({
      isExporting: true,
    });

    domtoimage
      .toBlob(this.chart, { bgcolor: "#fff" })
      .then((blob: Blob) => {
        FileSaver.saveAs(blob, `madgrades-${new Date().toISOString()}.png`);
        this.setState({
          isExporting: false,
        });
      })
      .catch((_error: Error) => {
        this.setState({
          isExporting: false,
        });
      });
  };

  render = (): JSX.Element => {
    const { uuid, data, instructorId, termCode } = this.props;
    const { isExporting } = this.state;

    let instructorOptions: InstructorOption[] = [];
    let termCodes: number[] = [];
    let termDescs: Record<number, string> = {};
    let instructorText = "All instructors";
    let termText = "All semesters";

    if (data && !data.isFetching) {
      instructorOptions.push({
        key: 0,
        value: 0,
        text: instructorText,
      });
      instructorOptions = instructorOptions.concat(
        data.instructors!.map((i) => {
          return {
            key: i.id,
            value: i.id,
            text: i.name,
            description: utils.grades.gpa(i.cumulative, true),
          };
        })
      );

      data.courseOfferings!.forEach((o) => {
        termCodes.push(o.termCode);
        termDescs[o.termCode] = utils.grades.gpa(o.cumulative, true);
      });

      if (instructorId) {
        let instructorName = "N/A";

        termCodes = termCodes.filter((code) => {
          if (code === 0) return true;

          const instructor = data.instructors!.filter(
            (i) => i.id === instructorId
          )[0];

          if (!instructor) return true;

          instructorName = instructor.name;
          return instructor.terms.map((term) => term.termCode).includes(code);
        });

        termText += ` (${instructorName})`;
      }

      if (termCode) {
        const termName = utils.termCodes.toName(termCode);
        instructorText += ` (${termName})`;

        instructorOptions = instructorOptions.filter((option) => {
          const id = option.value;

          if (id === 0) return true;

          const instructor = data.instructors!.find((i) => i.id === id);
          if (!instructor) return false;
          return instructor.terms
            .map((term) => term.termCode)
            .includes(termCode);
        });
      }

      instructorOptions[0]!.text = instructorText;
    }

    const instructorChosen = instructorId || undefined;
    const termChosen = termCode || undefined;

    return (
      <Row>
        <Col xs={12} md={12} lg={4}>
          <Form style={{ marginBottom: "1em" }}>
            <Form.Field>
              <label>Instructors</label>
              <Dropdown
                fluid
                selection
                search
                options={instructorOptions}
                onChange={this.onInstructorChange}
                value={instructorId}
              />
            </Form.Field>
            <Form.Field>
              <label>Semesters</label>
              <TermSelect
                value={termCode}
                termCodes={termCodes}
                includeCumulative={true}
                cumulativeText={termText}
                onChange={this.onTermCodeChange}
                descriptions={termDescs}
              />
            </Form.Field>
            <Form.Field>
              <label>Export</label>
              <Button
                icon="download"
                loading={isExporting}
                basic
                size="small"
                content="Save Image"
                onClick={this.onSaveChart}
              />
            </Form.Field>
          </Form>
        </Col>
        <Col xs={12} lg={8}>
          <div
            ref={(ref) => { this.chart = ref; }}
            style={{ marginBottom: "1em" }}
          >
            <CourseChart
              uuid={uuid}
              instructorId={instructorChosen}
              termCode={termChosen}
            />
          </div>
        </Col>
      </Row>
    );
  };
}

const CourseChartViewer: React.FC<CourseChartViewerProps> = (props) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.grades.courses.data[props.uuid]);

  return <CourseChartViewerClass {...props} data={data as CourseGradesResponse & { isFetching: boolean }} dispatch={dispatch} />;
};

export default CourseChartViewer;
