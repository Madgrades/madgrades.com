import { Container, Grid, Segment, Header, Button } from 'semantic-ui-react';
import CourseName from './CourseName';
import CourseChartViewer from './CourseChartViewer';
import CourseGpaChart from './CourseGpaChart';
import utils from '../utils';

interface CourseComparisonProps {
  course1Uuid: string;
  course2Uuid: string;
  onRemoveComparison: () => void;
  location: { search: string };
  navigate: (path: string) => void;
}

function CourseComparison({
  course1Uuid,
  course2Uuid,
  onRemoveComparison,
  location,
  navigate,
}: CourseComparisonProps) {
  const handleCourse1Change = (params: { instructorId?: number; termCode?: number }) => {
    const currentParams = new URLSearchParams(location.search);

    navigate(
      `/courses/${course1Uuid}?${utils.buildQueryString({
        instructorId: params.instructorId ?? 0,
        termCode: params.termCode ?? 0,
        course2InstructorId: currentParams.get('course2InstructorId') ?? '0',
        course2TermCode: currentParams.get('course2TermCode') ?? '0',
        compareWith: course2Uuid,
      })}`
    );
  };

  const handleCourse2Change = (params: { instructorId?: number; termCode?: number }) => {
    const currentParams = new URLSearchParams(location.search);

    navigate(
      `/courses/${course1Uuid}?${utils.buildQueryString({
        instructorId: currentParams.get('instructorId') ?? '0',
        termCode: currentParams.get('termCode') ?? '0',
        course2InstructorId: params.instructorId ?? 0,
        course2TermCode: params.termCode ?? 0,
        compareWith: course2Uuid,
      })}`
    );
  };

  const handleReplaceCourse1 = () => {
    navigate(`/search?compareWith=${course2Uuid}&replacing=1`);
  };

  const handleReplaceCourse2 = () => {
    navigate(`/search?compareWith=${course1Uuid}&replacing=2`);
  };

  const params = new URLSearchParams(location.search);

  const course1InstructorId = parseInt(params.get('instructorId') ?? '0', 10);
  const course1TermCode = parseInt(params.get('termCode') ?? '0', 10);
  const course2InstructorId = parseInt(params.get('course2InstructorId') ?? '0', 10);
  const course2TermCode = parseInt(params.get('course2TermCode') ?? '0', 10);

  return (
    <Container fluid style={{ padding: '20px 40px' }}>
      <div style={{ display: 'flex', gap: '1em', marginBottom: '2em' }}>
        <Button negative onClick={onRemoveComparison}>
          Remove Comparison
        </Button>
      </div>
      <Grid columns={2} divided relaxed>
        <Grid.Row>
          <Grid.Column>
            <Segment basic>
              <Header size="huge" style={{ marginBottom: '1em' }}>
                <Header.Content>
                  <CourseName uuid={course1Uuid} fallback={'(Unknown Name)'} />
                  <Header.Subheader style={{ marginTop: '0.5em' }}>
                    <CourseName uuid={course1Uuid} asSubjectAndNumber={true} />
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Button
                primary
                icon="exchange"
                content="Replace Course"
                onClick={handleReplaceCourse1}
                style={{ marginBottom: '1em' }}
              />
              <div className="chart-container" style={{ minHeight: '400px' }}>
                <CourseChartViewer
                  uuid={course1Uuid}
                  instructorId={course1InstructorId}
                  termCode={course1TermCode}
                  onChange={handleCourse1Change}
                />
              </div>
              <div className="chart-container" style={{ marginTop: '1em', minHeight: '300px' }}>
                <CourseGpaChart uuid={course1Uuid} />
              </div>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment basic>
              <Header size="huge" style={{ marginBottom: '1em' }}>
                <Header.Content>
                  <CourseName uuid={course2Uuid} fallback={'(Unknown Name)'} />
                  <Header.Subheader style={{ marginTop: '0.5em' }}>
                    <CourseName uuid={course2Uuid} asSubjectAndNumber={true} />
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <Button
                primary
                icon="exchange"
                content="Replace Course"
                onClick={handleReplaceCourse2}
                style={{ marginBottom: '1em' }}
              />
              <div className="chart-container" style={{ minHeight: '400px' }}>
                <CourseChartViewer
                  uuid={course2Uuid}
                  instructorId={course2InstructorId}
                  termCode={course2TermCode}
                  onChange={handleCourse2Change}
                />
              </div>
              <div className="chart-container" style={{ marginTop: '1em', minHeight: '300px' }}>
                <CourseGpaChart uuid={course2Uuid} />
              </div>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default CourseComparison;
