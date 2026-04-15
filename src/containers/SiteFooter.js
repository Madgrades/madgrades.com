import React, { Component } from "react";
import { Container, Divider, List, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Col } from "../components/Grid";
import logoBlack from "../assets/logo-black.svg";
import logoWhite from "../assets/logo-white.svg";
import SPONSOR from "../config/sponsorship";
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

  render = () => {
    const logo = this.props.theme === "dark" ? logoWhite : logoBlack;
    const sponsorLogo = SPONSOR
      ? this.props.theme === "dark"
        ? SPONSOR.logoWhite
        : SPONSOR.logoBlack
      : null;

    return (
      <div className="SiteFooter">
        <Divider />
        <Container>
          <Row between>
            <Col sm style={{ display: "flex", flex: "0 0 auto" }}>
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
                      Madgrades is unaffiliated with UW Madison.
                      <br />
                      Courses updated <LatestTerm />.
                    </small>
                  </List.Item>
                </List>
                <br />
              </span>
            </Col>
            {SPONSOR && (
              <Col
                xs
                style={{
                  flex: "1 1 auto",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Sponsored by{" "}
                <a
                  href={SPONSOR.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    marginLeft: "4px",
                  }}
                >
                  {sponsorLogo && (
                    <img
                      alt=""
                      src={sponsorLogo}
                      style={{ height: "16px", width: "auto", opacity: 0.7 }}
                    />
                  )}
                  {SPONSOR.name}
                </a>
              </Col>
            )}
            <Col auto style={{ textAlign: "right", flex: "0 0 auto" }}>
              <Label
                color="teal"
                horizontal
                as="a"
                href={import.meta.env.VITE_MADGRADES_API}
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
  };
}

const mapStateToProps = (state) => ({
  theme: state.app.theme,
});

export default connect(mapStateToProps)(SiteFooter);
