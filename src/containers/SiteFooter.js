import React, {Component} from "react";
import {Container, Divider, List} from "semantic-ui-react";
import {Link} from "react-router-dom";
import logo from "../assets/logo-black.svg"
import {Col, Row} from "react-flexbox-grid";
import gitRevFile from '../static/git-rev.txt';

class SiteFooter extends Component {
  state = {
    gitRev: ''
  };

  componentDidMount = () => {
    fetch(gitRevFile)
    .then(response => response.text())
    .then(text => {
      this.setState({
        gitRev: text.split(' ')[0]
      })
    });
  };

  render = () => (
      <Container className="SiteFooter">
        <Divider/>
        <Row middle='xs'>
          <Col>
            <Link to="/">
              <img alt="Madgrades Logo" className='logo' src={logo}/>
            </Link>
          </Col>
          <Col xs>
            <List horizontal floated='right'>
              <List.Item>
              </List.Item>
              <List.Item>
                <a href="https://api.madgrades.com">
                  API
                </a>
              </List.Item>
              <List.Item>
                <a href={`https://github.com/thekeenant/madgrades.com/commit/${this.state.gitRev}`}>
                  Rev: {this.state.gitRev || 'Source'}
                </a>
              </List.Item>
            </List>
          </Col>
        </Row>
      </Container>
  );
}

export default SiteFooter;