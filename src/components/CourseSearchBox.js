import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Form, Input} from "semantic-ui-react";
import {withRouter} from "react-router";

class CourseSearchBox extends Component {
  state = {
    searchValue: ""
  };

  componentWillReceiveProps = (nextProps) => {
    // when we get an outside search value update, reflect that in the
    // search box via the local state
    this.setState({
      searchValue: nextProps.courseSearchQuery
    })
  };

  performSearch = () => {
    // tell the app about the search!
    this.props.history.push(`/search/${this.state.searchValue}`);
  };

  onInputChange = (event, data) => {
    // update the state of the search box to the new value
    this.setState({
      searchValue: data.value
    })
  };

  render = () => {
    const { searchValue } = this.state;

    return (
        <Form onSubmit={this.performSearch}>
          <Input
              value={searchValue}
              fluid
              onChange={this.onInputChange}
              icon={{
                name: 'search',
                link: true,
                onClick: this.performSearch,
                title: "Perform Search"
              }}
              placeholder='Search courses...'
          />
        </Form>
    )
  }
}

function mapStateToProps(state, ownProps) {
  // we grab the app state search query, only used on page load basically
  // like when you refresh the search page for some odd reason
  return {
    courseSearchQuery: state.app.courseSearchQuery
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(CourseSearchBox))
