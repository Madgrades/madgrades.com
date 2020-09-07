import React from 'react';
import {Container, Header} from 'semantic-ui-react';

const Home = () => {
  document.title = 'UW Madison Grade Distributions - Madgrades';

  return (
      <div className='Home'>
        <Container>
          <Header as='h1'>
            <Header.Content>
              Madgrades
            </Header.Content>
            <Header.Subheader>
              UW Madison grade distribution visualizer built for students.
            </Header.Subheader>
          </Header>

          <p>
            Find grade distributions for University of
            Wisconsin - Madison (UW Madison) courses. Easily compare cumulative course
            grade distributions to particular instructors or semesters to
            get insight into a course which you are interested in taking.
            Get started by searching for a course in the search bar above.
          </p>

          <p>
            Note that this website is not necessarily complete and may contain
            bugs, misleading information, or errors in the data reported. Please
            help out by {' '}
            <a
              href='https://form.jotform.com/80705132647151'
              target='_blank'
              rel='noopener noreferrer'>
              reporting issues
            </a>
            {' '} or {' '}
            <a
              href='https://github.com/Madgrades/madgrades.com'
              target='_blank'
              rel='noopener noreferrer'>
              contributing fixes
            </a>.
          </p>
        </Container>
      </div>
  );
};
export default Home;