import React from 'react';
import {Button, Container, Divider, Icon} from 'semantic-ui-react';

const githubLink = 'https://github.com/Madgrades';

const About = () => {
  document.title = 'About - Madgrades';

  return (
    <div className='About'>
      <Container text>
        <p></p>
        <br/>
        <Divider horizontal>About</Divider>
        <p>
          Madgrades is a small, open source project created by a UW Madison
          student with the goal of making it easier to understand course
          grade distributions. The office of the registrar publishes PDF files
          which document GPA and grade reports for almost every course from
          each
          semester since 2006, and this website makes sense of that data.
        </p>
        <br/>
        <Divider horizontal>Help out!</Divider>
        <p>
          Do you have issues, questions, or suggestions regarding the website?
          Click the 'Provide Feedback' link
          and we can get back to you soon.
        </p>
        <p>
          This project is <a href={githubLink} target='_blank' rel='noopener noreferrer'>open source</a>.
          Pull requests are
          welcome, as I am sure there are
          awesome features yet to add and plenty of bugs to fix.
        </p>
        <center>
          <Button primary
                  href='https://form.jotform.com/80705132647151'
                  rel='noopener noreferrer'
                  target='_blank'>
            <Icon name='thumbs up'/>
            Provide Feedback
          </Button>
        </center>
        <br/>
        <Divider horizontal>Advertisements</Divier>
        <p>
          Hosting this website costs money: server costs, domain feeds, and engineering efforts.
          There is a single ad on the search page that helps fund the project. We do not sell
          any other ad slots, but we are happy to link out to support other student projects.
          Feel free to reach out!
        </p>
        <p>
        </p>
      </Container>
    </div>
  );
};
export default About;
