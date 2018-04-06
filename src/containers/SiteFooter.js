import React, {Component} from "react";
import {Container, Divider, List} from "semantic-ui-react";
import {Link} from "react-router-dom";
import logo from "../assets/logo-black.svg"
import {Col, Row} from "react-flexbox-grid";
import gitRevFile from '../assets/git-rev.txt';

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
      <div className="SiteFooter">
        <Divider/>
        <Container>
          <Row middle='xs'>
            <Col style={{display: "flex"}}>
              <Link to="/">
                <img alt="Madgrades Logo" className='logo' src={logo} style={{verticalAlign: 'middle'}}/>
              </Link>
              <span style={{marginLeft: "10px"}}>
                Made by <a href="https://keenant.com" target="_blank">Keenan Thompson</a><br/>
                <small>
                  Madgrades unaffiliated with UW Madison. All data is provided by the {' '}
                  <a href="https://registrar.wisc.edu/grade-reports/" target="_blank">registrar office</a>.
                </small>
              </span>
            </Col>
            <Col xs>
              <List horizontal floated='right'>
                <List.Item>
                </List.Item>
                <List.Item>
                  <a href={process.env.REACT_APP_MADGRADES_API} target="_blank">
                    API
                  </a>
                </List.Item>
                <List.Item>
                  <a href={`https://github.com/thekeenant/madgrades.com/commit/${this.state.gitRev}`} target="_blank">
                    Rev: {this.state.gitRev || 'Source'}
                  </a>
                </List.Item>
              </List>
            </Col>
          </Row>
        </Container>
      </div>
  );
}

export default SiteFooter;