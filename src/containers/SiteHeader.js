import React, {Component} from "react";
import {Divider, Grid, Header} from "semantic-ui-react";
import CourseSearchBox from "../components/CourseSearchBox";
import "../styles/containers/SiteHeader.css"

const SiteHeader = () => (
    <div className="SiteHeader">
      <Grid doubling columns={2} verticalAlign="bottom">
        <Grid.Column>
          <Header as='h2'>
            <Header.Content>
              Madgrades
              <Header.Subheader>
                University of Wisconsin - Madison Course Data
              </Header.Subheader>
            </Header.Content>
          </Header>
        </Grid.Column>
        <Grid.Column floated='right' textAlign="right" width={5}>
          <CourseSearchBox/>
        </Grid.Column>
      </Grid>
      <Divider/>
    </div>
);
export default SiteHeader;