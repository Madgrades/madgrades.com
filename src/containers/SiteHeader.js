import React from "react";
import {Divider, Grid, Header} from "semantic-ui-react";
import CourseSearchBox from "../components/CourseSearchBox";
import "../styles/containers/SiteHeader.css";
import * as classnames from "classnames";

const SiteHeader = ({style, className}) => (
    <div className={classnames("SiteHeader", className)} style={style}>
      <Grid doubling columns={2} verticalAlign="bottom">
        <Grid.Column width={6}>
          <Header as='h2'>
            <Header.Content>
              Madgrades
              <Header.Subheader>
                UW Madison Course Data
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