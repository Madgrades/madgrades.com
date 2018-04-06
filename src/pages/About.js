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
          This project is <a href={githubLink} target='_blank'>open source</a>.
          Pull requests are
          welcome, as I am sure there are
          awesome features yet to add and plenty of bugs to fix.
        </p>
        <p>
          Hosting this website costs money. Help me keep this project going by
          clicking the button below.
        </p>

        <p>
        </p>

        <center>
          <form action='https://www.paypal.com/cgi-bin/webscr' method='post'
                target='_top'>
            <input type='hidden' name='cmd' value='_donations'/>
            <input type='hidden' name='business' value='keenan@keenant.com'/>
            <input type='hidden' name='lc' value='US'/>
            <input type='hidden' name='item_name' value='Madgrades'/>
            <input type='hidden' name='no_note' value='0'/>
            <input type='hidden' name='currency_code' value='USD'/>
            <input type='hidden' name='bn'
                   value='PP-DonationsBF:btn_donate_SM.gif:NonHostedGuest'/>
            <Button primary
                    href='https://form.jotform.com/80705132647151'
                    rel='noopener noreferrer'
                    target='_blank'>
              <Icon name='thumbs up'/>
              Provide Feedback
            </Button>
            <Button color='red' type='submit'>
              <Icon name='heart'/>
              Donate
            </Button>
          </form>
        </center>

      </Container>
    </div>
  );
};
export default About;