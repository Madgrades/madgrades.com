import { useState, useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';
import { Button, Dropdown, Form } from 'semantic-ui-react';
import { Row, Col } from './Grid';
import TermSelect from '../containers/TermSelect';
import CourseChart from './CourseChart';
import domtoimage from 'dom-to-image';
import FileSaver from 'file-saver';

interface OwnProps {
  uuid: string;
  termCode?: number;
  instructorId?: number;
  onChange?: (params: { termCode?: number; instructorId?: number }) => void;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function CourseChartViewer({
  uuid,
  termCode,
  instructorId,
  onChange = () => {},
  data,
  actions,
}: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    actions.fetchCourseGrades(uuid);
  }, [uuid, actions]);

  const onTermCodeChange = (newTermCode: number) => {
    onChange({ termCode: newTermCode, instructorId });
  };

  const onInstructorChange = (event: any, { value }: { value: number }) => {
    onChange({ termCode, instructorId: value });
  };

  const onSaveChart = () => {
    if (isExporting || !chartRef.current) return;

    setIsExporting(true);

    domtoimage
      .toBlob(chartRef.current, { bgcolor: '#fff' })
      .then((blob) => {
        FileSaver.saveAs(blob, `madgrades-${new Date().toISOString()}.png`);
        setIsExporting(false);
      })
      .catch((error) => {
        setIsExporting(false);
      });
  };

  let instructorOptions: any[] = [],
    termCodes: number[] = [];
  const termDescs: { [key: number]: string } = {};
  let instructorText = 'All instructors',
    termText = 'All semesters';

  if (data && !data.isFetching) {
    instructorOptions.push({
      key: 0,
      value: 0,
      text: instructorText,
    });
    instructorOptions = instructorOptions.concat(
      data.instructors.map((i: any) => {
        return {
          key: i.id,
          value: i.id,
          text: i.name,
          description: utils.grades.gpa(i.cumulative, true),
        };
      })
    );

    data.courseOfferings.forEach((o: any) => {
      termCodes.push(o.termCode);
      termDescs[o.termCode] = utils.grades.gpa(o.cumulative, true);
    });

    // if instructor selected, filter term codes
    if (instructorId) {
      let instructorName = 'N/A';

      termCodes = termCodes.filter((code) => {
        if (code === 0) return true;

        const instructor = data.instructors.filter((i: any) => i.id === instructorId)[0];

        if (!instructor) return true;

        instructorName = instructor.name;
        return instructor.terms.map((term: any) => term.termCode).includes(code);
      });

      termText += ` (${instructorName})`;
    }

    // if term code selected, filter instructor options
    if (termCode) {
      const termName = utils.termCodes.toName(termCode);
      instructorText += ` (${termName})`;

      instructorOptions = instructorOptions.filter((option) => {
        const id = option.value;

        if (id === 0) return true;

        const instructor = data.instructors.filter((i: any) => i.id === id)[0];
        return instructor.terms.map((term: any) => term.termCode).includes(termCode);
      });
    }

    instructorOptions[0].text = instructorText;
  }

  const instructorChosen = instructorId || undefined,
    termChosen = termCode || undefined;

  return (
    <Row>
      <Col xs={12} md={12} lg={4}>
        <Form style={{ marginBottom: '1em' }}>
          <Form.Field>
            <label>Instructors</label>
            <Dropdown
              fluid
              selection
              search
              options={instructorOptions}
              onChange={onInstructorChange}
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
              onChange={onTermCodeChange}
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
              onClick={onSaveChart}
            />
          </Form.Field>
        </Form>
      </Col>
      <Col xs={12} lg={8}>
        <div ref={chartRef} style={{ marginBottom: '1em' }}>
          <CourseChart uuid={uuid} instructorId={instructorChosen} termCode={termChosen} />
        </div>
      </Col>
    </Row>
  );
}

function mapStateToProps(state: RootState, ownProps: { uuid: string }) {
  const data = state.grades.courses.data[ownProps.uuid];

  return {
    data,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(CourseChartViewer);
