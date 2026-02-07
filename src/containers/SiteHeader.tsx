import React, { useEffect, useState } from "react";
import { Button, Container, Menu, Segment } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import Div from "./Div";
import SearchBox from "../components/SearchBox";
import logo from "../assets/logo-white.svg";

const SiteHeader: React.FC = () => {
  const location = useLocation();
  const [isNavToggled, setIsNavToggled] = useState(false);

  useEffect(() => {
    setIsNavToggled(false);
  }, [location.pathname]);

  const toggleNav = (): void => {
    setIsNavToggled(!isNavToggled);
  };

  const toggled = isNavToggled ? "toggled" : "";
  const { pathname } = location;

  return (
    <Segment as={Div} inverted attached className="SiteHeader">
      <Menu inverted pointing secondary stackable>
        <Container>
          <Menu.Item className="madgrades-logo">
            <Button
              as="a"
              className="toggle-button"
              icon="bars"
              color="grey"
              basic
              onClick={toggleNav}
            />
            <NavLink to="/">
              <img
                alt="Madgrades Logo"
                src={logo}
                width={40}
                style={{ display: "inline-block", marginRight: "10px" }}
              />
            </NavLink>
            <div style={{ width: "40px" }} />
          </Menu.Item>

          <Menu.Menu
            className={`toggleable ${toggled}`}
            style={{ alignItems: "center" }}
          >
            <Menu.Item style={{ alignSelf: "center" }}>
              <SearchBox />
            </Menu.Item>
            <Menu.Menu position="right">
              <Menu.Item
                as={NavLink}
                to="/search"
                active={pathname.startsWith("/search")}
              >
                Courses
              </Menu.Item>
              <Menu.Item as={NavLink} to="/explore">
                Explore
              </Menu.Item>
              <Menu.Item as={NavLink} to="/about">
                About
              </Menu.Item>
            </Menu.Menu>
          </Menu.Menu>
        </Container>
      </Menu>
    </Segment>
  );
};

export default SiteHeader;
