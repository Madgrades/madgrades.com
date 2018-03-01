import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Input} from "semantic-ui-react";
import {withRouter} from "react-router";

class CourseSearchBox extends Component {
  searchValue = undefined;
  state = {
    isTyping: false
  };

  componentWillMount = () => {
    const { actions } = this.props;
  };

  onInputChange = (event, data) => {
    const { setCourseSearchQuery } = this.props.actions;
    const { value } = data;
    this.searchValue = value;
    this.setState({
      isTyping: true
    });

    // delay search request so as to not spam requests
    setTimeout(() => {
      if (this.searchValue === value) {
        setCourseSearchQuery(value);
        this.setState({
          isTyping: false
        });

        // go to home page
        this.props.history.push('/');
      }
    }, 500);
  };

  render = () => {
    const { isTyping } = this.state;

    return (
        <Input
            loading={isTyping}
            fluid
            onChange={this.onInputChange}
            icon='search'
            placeholder='Search courses...'
        />
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(CourseSearchBox))
