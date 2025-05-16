import React from 'react';
import {Header, Segment, Button} from 'semantic-ui-react';
import CourseName from '../components/CourseName';
import {Link, withRouter} from 'react-router-dom';
import SubjectNameList from './SubjectNameList';

const CourseSearchResultItem = ({result, location, history}) => {
  const params = new URLSearchParams(location.search);
  const compareWith = params.get('compareWith');

  const handleCompare = () => {
    if (compareWith) {
      // If we're already in comparison mode, navigate to the comparison view
      history.push(`/courses/${compareWith}?compareWith=${result.uuid}`);
    } else {
      // Otherwise, add the current course as the comparison target
      history.push(`/search?compareWith=${result.uuid}`);
    }
  };

  return (
    <Segment color='blue'>
      <Header>
        <Header.Content as={Link} to={`/courses/${result.uuid}`}>
          <CourseName
              data={result}
              uuid={result.uuid}
              fallback={'(Unknown Name)'}/>
          <Header.Subheader>
            <SubjectNameList
              subjects={result.subjects}/> {result.number}
          </Header.Subheader>
        </Header.Content>
      </Header>
      <Button 
        primary 
        size='small' 
        onClick={handleCompare}
        style={{ marginTop: '1em' }}
      >
        {compareWith ? 'Compare with this course' : 'Compare'}
      </Button>
    </Segment>
  );
};

export default withRouter(CourseSearchResultItem);