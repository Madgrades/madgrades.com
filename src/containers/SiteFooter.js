import React from "react";
import {Divider, Icon} from "semantic-ui-react";
import "../styles/containers/SiteFooter.css";
import {Link} from "react-router-dom";

const SiteFooter = () => (
    <div className="SiteFooter">
      <Divider/>
      <p>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </p>
    </div>
);
export default SiteFooter;