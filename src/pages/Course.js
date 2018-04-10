import React from 'react';
import CourseName from '../components/CourseName';
import {Container, Divider, Header} from 'semantic-ui-react';
import CourseChartViewer from '../components/CourseChartViewer';
import CourseGpaChart from '../components/CourseGpaChart';
import {parse, stringify} from 'qs';
import CourseData from "../components/CourseData";

const Course = ({ match, location, history }) => {
  document.title = ' - Madgrades';

  const { uuid } = match.params;
  const params = parse(location.search.substr(1));

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
        <Divider/>
        <CourseChartViewer
            instructorId={instructorId}
            termCode={termCode}
            onChange={onChange}
            uuid={uuid}/>
        <Divider/>
        <CourseGpaChart uuid={uuid}/>
      </Container>
  )
};
export default Course;