import React, { Component } from "react";
import { Button, Container, Icon, Menu, Segment } from "semantic-ui-react";
import { NavLink, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { toggleTheme } from "../redux/actions/app";
import Div from "./Div";
import SearchBox from "../components/SearchBox";
import logo from "../assets/logo-white.svg";

class SiteHeader extends Component {
  state = {
    isNavToggled: false,
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        isNavToggled: false,
      });
    }
  };

  toggleNav = () => {
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
                  active={pathname.startsWith("/search") || pathname.startsWith("/courses")}
                >
                  Courses
                </Menu.Item>
                <Menu.Item as={NavLink} to="/explore">
                  Explore
                </Menu.Item>
                <Menu.Item as={NavLink} to="/about">
                  About
                </Menu.Item>
                <Menu.Item
                  as="a"
                  onClick={this.props.toggleTheme}
                  style={{ cursor: "pointer" }}
                  title={
                    this.props.theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  <Icon name={this.props.theme === "dark" ? "sun" : "moon"} />
                </Menu.Item>
              </Menu.Menu>
            </Menu.Menu>
          </Container>
        </Menu>
      </Segment>
    );
  };
}

// HOC to inject location as prop
function withLocation(Component) {
  return function ComponentWithLocation(props) {
    const location = useLocation();
    return <Component {...props} location={location} />;
  };
}

const mapStateToProps = (state) => ({
  theme: state.app.theme,
});

const mapDispatchToProps = {
  toggleTheme,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withLocation(SiteHeader));
