import React from "react";
import {Button, Container, Divider, Icon} from "semantic-ui-react";

const githubLink = "https://github.com/Madgrades";
const gradeDistLink = "https://registrar.wisc.edu/wp-content/uploads/sites/36/2017/09/report-gradedistribution-2010-2011spring.pdf";

const About = () => {
  document.title = "About - Madgrades";

  return (
    <div className="About">
      <Container text>
        <p></p>
        <br/>
        <Divider horizontal>About</Divider>
        <p>
          It's not fun, nor is it easy to go through
          the various <a href={gradeDistLink}>PDF files</a> provided by the Office
          of the Registrar to find a simple
          statistic such as the average GPA of a certain class taught in a
          particular semester. Why can't they provide a simple web interface that
          allows students and
          faculty to easily make sense of this data?
        </p>
        <p>
          Madgrades solves this problem by
          using <strong>coding</strong> and <strong>algorithms</strong>.
          We take the various PDF files, extract the tables from them, and then
          organize the data.
          This website allows you to browse that data. You can find various charts
          and statistics
          on UW Madison courses, instructors, and semesters as far back as 2006.
        </p>
        <br/>
        <Divider horizontal>Help out!</Divider>
        <p>
          Do you have issues, questions, or suggestions regarding the website?
          Click the "Provide Feedback" link
          and we can get back to you soon.
        </p>
        <p>
          This project is <a href={githubLink}>open source</a>. Pull requests are
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
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post"
                target="_top">
            <input type="hidden" name="cmd" value="_donations"/>
            <input type="hidden" name="business" value="keenan@keenant.com"/>
            <input type="hidden" name="lc" value="US"/>
            <input type="hidden" name="item_name" value="Madgrades"/>
            <input type="hidden" name="no_note" value="0"/>
            <input type="hidden" name="currency_code" value="USD"/>
            <input type="hidden" name="bn"
                   value="PP-DonationsBF:btn_donate_SM.gif:NonHostedGuest"/>
            <Button primary href='https://form.jotform.com/80705132647151'>
              <Icon name='thumbs up'/>
              Provide Feedback
            </Button>
            <Button color="red" type="submit">
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