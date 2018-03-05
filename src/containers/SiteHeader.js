import React, {Component} from "react";
import {Button, Container, Image, Menu, Segment} from "semantic-ui-react";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router";
import Div from "./Div";
import SearchBox from "../components/SearchBox";
import logo from "../assets/icon-white.svg";

class SiteHeader extends Component {
  state = {
    isNavToggled: false
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      isNavToggled: false
    });
  };

  toggleNav = () => {
    this.setState({
      isNavToggled: !this.state.isNavToggled
    })
  };

  render = () => {
    const { isNavToggled } = this.state;
    const toggled = isNavToggled ? "toggled" : "";

    return (
        <Segment as={Div} inverted attached className="SiteHeader">
          <Menu inverted pointing secondary stackable>
            <Container>
              <Menu.Item className='madgrades-logo'>
                <Button as='a' className='toggle-button' icon='bars' color='grey' basic onClick={this.toggleNav}/>
                <NavLink to="/">
                  <img src={logo} width={40} style={{display: "inline-block", marginRight: "10px"}}/>
                </NavLink>
                <div style={{width: "40px"}}/>
              </Menu.Item>

              <Menu.Menu className={`toggleable ${toggled}`} style={{alignItems: "center"}}>
                <Menu.Item style={{alignSelf: "center"}}>
                  <SearchBox/>
                </Menu.Item>
                <Menu.Menu position='right'>
                  <Menu.Item as={NavLink} to="/courses">
                    Courses
                  </Menu.Item>
                  <Menu.Item as={NavLink} to="/instructors">
                    Instructors
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
  }
}
export default withRouter(SiteHeader)