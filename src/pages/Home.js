import React from 'react';
import {Container, Header, Divider} from 'semantic-ui-react';
import PromoCard from '../containers/PromoCard';

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

          <Divider section />

          <Header as='h2'>
            <Header.Content>
              Other UW Madison Student Projects
            </Header.Content>
            <Header.Subheader>
              Check out these helpful tools built by UW Madison students
            </Header.Subheader>
          </Header>

          <PromoCard
            title="EnrollAlert"
            description="Track real-time enrollment status for your courses and get notified when seats become available. Course information updates along with UW Course Search & Enroll, so you'll receive notifications as soon as seats open up."
            link="https://enrollalert.com"
            isNew={true}
          />

          <PromoCard
            title="enRollBadge"
            description="Sign up today to receive real-time notifications when classes open!"
            link="http://enrollbadge.com"
          />

          <PromoCard
            title="MadHousing"
            description="Love your dorm or don't? Come share your opinion! Review UW-Madison dorms and help future students make informed housing decisions."
            link="http://madhousing.com"
          />
        </Container>
      </div>
  );
};
export default Home;