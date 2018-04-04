import React from "react";
import {Button, Container, Header} from "semantic-ui-react";
import {Link} from "react-router-dom";

const Home = () => (
    <div className="Home">
      <Container text>
        <p></p>
        <Header as='h1'>
          <Header.Content>
            Madgrades
          </Header.Content>
          <Header.Subheader>
            Built for UW Madison students
          </Header.Subheader>
        </Header>

        <p>
          This website allows you to find grade distributions for University of
          Wisconsin - Madison courses. Easily compare cumulative course
          grade distributions to particular instructors or semesters to
          get insight into a course which you are interested in taking.
          Get started by searching for a course in the search bar above.
        </p>

        <p>
          Note that this website is not necessarily complete and may contain
          bugs, misleading information, or errors in the data reported. Please help out by {' '}
          <a href="https://form.jotform.com/80705132647151">reporting issues</a>
          {' '} or {' '}
          <a href="https://github.com/Madgrades/madgrades.com">contributing fixes</a>.
        </p>

        <Button as={Link} to='/search' primary>
          Start your search
        </Button>
      </Container>
    </div>
);
export default Home;