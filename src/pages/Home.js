import React from "react";
import {Button, Container, Divider, Header, Image} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {Col, Row} from "react-flexbox-grid";
import exampleExplore from "../assets/example-explore.png"
import exampleChart from "../assets/example-chart.png"

const Home = () => {
  document.title = "UW Madison Grade Distributions - Madgrades";

  return (
      <div className="Home">
        <Container text>
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
            <a href="https://form.jotform.com/80705132647151" target="_blank">reporting issues</a>
            {' '} or {' '}
            <a href="https://github.com/Madgrades/madgrades.com" target="_blank">contributing
              fixes</a>.
          </p>
        </Container>

        <br/>
        <Divider/>
        <br/>

        <Container>
          <Row>
            <Col xs={12} lg={6}>
              <p/>
              <Header as='h2'>
                <Header.Content>
                  Visualize course grades.
                </Header.Content>
              </Header>

              <p>
                Before you take a class, it can be helpful to know how
                challenging it is for other students, and how it may factor
                into your GPA. Use Madgrades to get a better idea of the
                course before you click the enroll button in the student center.
              </p>

              <p>
                Use the search page to find a course that you are interesting
                in taking or learning more about. Open a course page to
                view its cumulative grade distribution and to compare how
                certain instructors have taught the class.
              </p>

              <Button as={Link} to='/search' primary>
                View courses
              </Button>
              <p/><br/>
            </Col>
            <Col xs={12} lg={6}>
              <Image src={exampleChart} className='img-example'/>
            </Col>
          </Row>
        </Container>

        <br/>
        <Divider/>
        <br/>

        <Container>
          <Row>
            <Col xs={12} lg={6}>
              <p/>
              <Header as='h2'>
                <Header.Content>
                  Explore courses, instructors, and subjects!
                </Header.Content>
              </Header>

              <p>
                Use the explore page to discover interesting statistics on
                UW Madison courses, instructors, and subjects.
              </p>

              <p>
                For example, it's easy to find out, on average,
                {' '}
                <Link to='/explore/course?sort=gpa&order=asc'>courses that have been the most challenging for students</Link>, or
                {' '}
                <Link to='/explore/instructor?sort=gpa&order=desc'>the instructors who have given the highest grades</Link>.
                Try it yourself!
              </p>

              <Button as={Link} to='/explore' primary>
                Start exploring
              </Button>
              <p/><br/>
            </Col>
            <Col xs={12} lg={6}>
              <Image src={exampleExplore} className='img-example'/>
            </Col>
          </Row>
        </Container>
      </div>
  );
};
export default Home;