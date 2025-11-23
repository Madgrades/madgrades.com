import React from 'react';
import { Container, Divider, Header, Button } from 'semantic-ui-react';
import CourseName from '../components/CourseName';
import CourseChartViewer from '../components/CourseChartViewer';
import CourseGpaChart from '../components/CourseGpaChart';
import CourseComparison from '../components/CourseComparison';
import CourseData from '../components/CourseData';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const Course = () => {
  document.title = ' - Madgrades';

  const { uuid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const compareWith = searchParams.get('compareWith') ?? undefined;
  const instructorIdParam = searchParams.get('instructorId');
  const termCodeParam = searchParams.get('termCode');

  const instructorId = parseInt(instructorIdParam ?? '0', 10);
  const termCode = parseInt(termCodeParam ?? '0', 10);

  const onChange = (params: { instructorId?: number; termCode?: number }) => {
    const newParams = new URLSearchParams();
    if (params.instructorId) {
      newParams.set('instructorId', params.instructorId.toString());
    }
    if (params.termCode) {
      newParams.set('termCode', params.termCode.toString());
    }
    navigate(`/courses/${uuid ?? ''}?${newParams.toString()}`);
  };

  const onCourseDataLoad = (data: {
    name: string;
    subjects: { abbreviation?: string }[];
    number: string;
  }) => {
    const { name, subjects, number } = data;

    const visibleName = name || 'Unknown Name';
    const title = `${visibleName} - Madgrades`;

    let desc = `${subjects
      .map(s => s.abbreviation || '')
      .slice(0, 3)
      .join(', ')} ${number}`;
    desc += ' UW Madison course grade distribution and average GPA over time or by instructor.';

    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', desc);
  };

  const handleCompare = () => {
    // Navigate to search page with current course pre-selected
    navigate(`/search?compareWith=${uuid ?? ''}`);
  };

  const removeComparison = () => {
    navigate(`/courses/${uuid ?? ''}`);
  };

  if (compareWith && uuid) {
    return (
      <CourseComparison
        course1Uuid={uuid}
        course2Uuid={compareWith}
        onRemoveComparison={removeComparison}
        location={location}
        navigate={navigate}
      />
    );
  }

  return (
    <Container className="Course">
      <CourseData uuid={uuid} onDataLoad={onCourseDataLoad} />
      <Header size="huge">
        <Header.Content style={{ maxWidth: '100%' }}>
          <CourseName uuid={uuid} fallback={'(Unknown Name)'} />
          <Header.Subheader style={{ maxWidth: '100%' }}>
            <CourseName uuid={uuid} asSubjectAndNumber={true} />
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Button primary onClick={handleCompare} style={{ marginBottom: '1em' }}>
        Compare with Another Course
      </Button>
      <Divider />
      <CourseChartViewer
        instructorId={instructorId}
        termCode={termCode}
        onChange={onChange}
        uuid={uuid}
      />
      <Divider />
      <CourseGpaChart uuid={uuid} />
    </Container>
  );
};

export default Course;
