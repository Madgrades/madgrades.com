import React from "react";
import {Container, Divider, Grid, List} from "semantic-ui-react";
import {Link} from "react-router-dom";
import logo from "../assets/logo-black.svg"

const SiteFooter = () => (
    <div className="SiteFooter">
      <Container>
        <Divider/>
        <Grid verticalAlign="middle">
          <Grid.Column width={7}>
            <List horizontal>
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
          </Grid.Column>
          <Grid.Column width={2} className="logo">
            <Link to="/">
              <img title="Madgrades Logo" src={logo}/>
            </Link>
          </Grid.Column>
          <Grid.Column width={7} textAlign="right">
            <List horizontal>
              <List.Item>
                Data from <a href="https://registrar.wisc.edu/">UW Madison</a>
              </List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
);
export default SiteFooter;