import React from "react";
import {Container, Divider, List} from "semantic-ui-react";
import {Link} from "react-router-dom";
import logo from "../assets/logo-black.svg"
import {Col, Row} from "react-flexbox-grid";

const SiteFooter = () => (
    <Container className="SiteFooter">
      <Divider/>
      <Row middle='xs'>
        <Col xs>
          <Link to="/">
            <img alt="Madgrades Logo" className='logo' src={logo}/>
          </Link>
        </Col>
        <Col xs>
          <List horizontal floated='right'>
            <List.Item>
              <Link to="/about">
                About
              </Link>
            </List.Item>
            <List.Item>
              <a href="https://api.madgrades.com">
                API
              </a>
            </List.Item>
            <List.Item>
              <a href="https://github.com/thekeenant/madgrades">
                Source
              </a>
            </List.Item>
          </List>
        </Col>
      </Row>
    </Container>
);
export default SiteFooter;