import React from 'react';
import { Container, Divider, Header, Button } from 'semantic-ui-react';
import CourseName from '../components/CourseName';
import CourseChartViewer from '../components/CourseChartViewer';
import CourseGpaChart from '../components/CourseGpaChart';
import CourseComparison from '../components/CourseComparison';
import { parse, stringify } from 'qs';
import CourseData from "../components/CourseData";

const Course = ({ match, location, history }) => {
  document.title = ' - Madgrades';

  const { uuid } = match.params;
  const params = parse(location.search.substr(1));
  const { compareWith } = params;

  let { instructorId, termCode } = params;

  instructorId = parseInt(instructorId || '0', 10);
  termCode = parseInt(termCode || '0', 10);

  const onChange = (params) => {
    history.push(`/courses/${uuid}?${stringify(params)}`)
  };

  const onCourseDataLoad = (data) => {
    const { name, subjects, number } = data;

    let visibleName = name || 'Unknown Name';
    let title = visibleName + ' - Madgrades';

    let desc = subjects.map((s) => s.abbreviation).slice(0, 3).join(', ') + ' ' + number;
    desc += ' UW Madison course grade distribution and average GPA over time or by instructor.';

    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute('content', desc);
  };

  const handleCompare = () => {
    // Navigate to search page with current course pre-selected
    history.push(`/search?compareWith=${uuid}`);
  };

  const removeComparison = () => {
    history.push(`/courses/${uuid}`);
  };

  if (compareWith) {
    return (
      <CourseComparison
        course1Uuid={uuid}
        course2Uuid={compareWith}
        onRemoveComparison={removeComparison}
        location={location}
        history={history}
      />
    );
  }

  return (
    <Container className='Course'>
      <CourseData
        uuid={uuid}
        onDataLoad={onCourseDataLoad}/>
      <Header size='huge'>
        <Header.Content style={{maxWidth: '100%'}}>
          <CourseName
              uuid={uuid}
              fallback={'(Unknown Name)'}/>
          <Header.Subheader style={{maxWidth: '100%'}}>
            <CourseName
                uuid={uuid}
                asSubjectAndNumber={true}/>
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Button 
        primary 
        onClick={handleCompare}
        style={{ marginBottom: '1em' }}
      >
        Compare with Another Course
      </Button>
      <Divider/>
      <CourseChartViewer
          instructorId={instructorId}
          termCode={termCode}
          onChange={onChange}
          uuid={uuid}/>
      <Divider/>
      <CourseGpaChart uuid={uuid}/>
    </Container>
  );
};

export default Course;