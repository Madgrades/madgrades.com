import React from "react";
import {Divider, Icon} from "semantic-ui-react";
import "../styles/containers/SiteFooter.css";

const SiteFooter = () => (
    <div className="SiteFooter">
      <Divider/>
      <p>
        Made by Keenan Thompson
        (<a href="https://github.com/thekeenant/madgrades">Github</a>)
      </p>
    </div>
);
export default SiteFooter;