import React, { Component } from "react";
import { Container, Divider, List, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Row, Col } from "../components/Grid";
import logo from "../assets/logo-black.svg";
import gitRevFile from "../assets/git-rev.txt";
import LatestTerm from "../components/LatestTerm";
import ApiStatusPill from "./ApiStatusPill";

const commitUrl = "https://github.com/Madgrades/madgrades.com/commit/";

class SiteFooter extends Component {
  state = {
    gitRev: "",
  };

  componentDidMount = () => {
    fetch(gitRevFile)
      .then((response) => response.text())
      .then((text) => {
        this.setState({
          gitRev: text.split(" ")[0],
        });
      });
  };

  render = () => (
    <div className="SiteFooter">
      <Divider />
      <Container>
        <Row between>
          <Col sm style={{ display: "flex" }}>
            <Link to="/">
              <img
                alt="Madgrades Logo"
                className="logo"
                src={logo}
                style={{ verticalAlign: "middle" }}
              />
            </Link>
            <span style={{ marginLeft: "10px" }}>
              <List horizontal floated="right">
                <List.Item>
                  Made by{" "}
                  <a
                    href="https://keenant.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Keenan Thompson
                  </a>
                  <br />
                  <small>
                    Madgrades is unaffiliated with UW Madison. Courses updated{" "}
                    <LatestTerm />.
                  </small>
                </List.Item>
              </List>
              <br />
            </span>
          </Col>
          <Col auto>
            <Label
              color="teal"
              horizontal
              as="a"
              href={process.env.REACT_APP_MADGRADES_API}
            >
              <Icon name="code" />
              API
            </Label>
            <Label
              color="black"
              horizontal
              as="a"
              href={`${commitUrl}${this.state.gitRev}`}
            >
              <Icon name="code branch" /> rev {this.state.gitRev || "Source"}
            </Label>
            <ApiStatusPill />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default SiteFooter;
