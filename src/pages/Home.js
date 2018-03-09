import React from "react";
import {Container, Header} from "semantic-ui-react";
import {Link} from "react-router-dom";

const Home = () => (
    <div className="Home">
      <Container text>
        <p></p>
        <Header as='h1'>
          <Header.Content>
            Welcome to Madgrades!
          </Header.Content>
          <Header.Subheader>
            Things aren't quite finished here...
          </Header.Subheader>
        </Header>

        <p>
          Although the website is not quite finished, you can still explore using
          the search bar in the navigation area above. If you are interested
          in helping out with the project, visit the <Link to="/about">about</Link> page.
        </p>
      </Container>
    </div>
);
export default Home;