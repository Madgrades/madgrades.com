import React, { useEffect, useState } from "react";
import { Container, Divider, List, Label, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Row, Col } from "../components/Grid";
import logo from "../assets/logo-black.svg";
import gitRevFile from "../assets/git-rev.txt";
import LatestTerm from "../components/LatestTerm";
import ApiStatusPill from "./ApiStatusPill";

const commitUrl = "https://github.com/Madgrades/madgrades.com/commit/";

const SiteFooter: React.FC = () => {
  const [gitRev, setGitRev] = useState("");

  useEffect(() => {
    fetch(gitRevFile)
      .then((response) => response.text())
      .then((text) => {
        const rev = text.split(" ")[0];
        setGitRev(rev || "");
      });
  }, []);

  return (
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
          <Col auto style={{ textAlign: "right" }}>
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
              href={`${commitUrl}${gitRev}`}
            >
              <Icon name="code branch" /> rev {gitRev || "Source"}
            </Label>
            <ApiStatusPill />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SiteFooter;
