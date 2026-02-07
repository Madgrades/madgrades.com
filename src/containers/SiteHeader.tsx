import React, { Component } from "react";
import { Button, Container, Menu, Segment } from "semantic-ui-react";
import { NavLink, useLocation, Location } from "react-router-dom";
import Div from "./Div";
import SearchBox from "../components/SearchBox";
import logo from "../assets/logo-white.svg";

interface SiteHeaderProps {
  location: Location;
}

interface SiteHeaderState {
  isNavToggled: boolean;
}

class SiteHeader extends Component<SiteHeaderProps, SiteHeaderState> {
  state: SiteHeaderState = {
    isNavToggled: false,
  };

  componentDidUpdate = (prevProps: SiteHeaderProps): void => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        isNavToggled: false,
      });
    }
  };

  toggleNav = (): void => {
    this.setState({
      isNavToggled: !this.state.isNavToggled,
    });
  };

  render = () => {
    const { isNavToggled } = this.state;
    const toggled = isNavToggled ? "toggled" : "";

    const { pathname } = this.props.location;

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
                onClick={this.toggleNav}
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
}

function withLocation(Component: React.ComponentType<SiteHeaderProps>) {
  return function ComponentWithLocation(props: Record<string, never>) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
}

export default withLocation(SiteHeader);
