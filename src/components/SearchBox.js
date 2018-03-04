import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Form, Input} from "semantic-ui-react";
import {withRouter} from "react-router";

class SearchBox extends Component {
  state = {
    searchValue: ""
  };

  componentWillReceiveProps = (nextProps) => {
    // when we get an outside search value update, reflect that in the
    // search box via the local state
    this.setState({
      searchValue: nextProps.searchQuery
    })
  };

  performSearch = () => {
    const { searchValue } = this.state;

    // tell the app about the search!
    this.props.history.push(`/search/${searchValue}`);
  };

  onInputChange = (event, data) => {
    // update the state of the search box to the new value
    this.setState({
      searchValue: data.value
    })
  };

  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.performSearch();
      event.target.blur();
    }
  };

  render = () => {
    const { searchValue } = this.state;

    return (
        <Input
            className='SearchBox'
            style={{minWidth: "250px"}}
            value={searchValue}
            onChange={this.onInputChange}
            onKeyPress={this.onKeyPress}
            icon={{
              name: 'search',
              link: true,
              onClick: this.performSearch,
              title: "Perform Search"
            }}
            placeholder='Search...'
            fluid
        />
    )
  }
}

function mapStateToProps(state, ownProps) {
  // we grab the app state search query, only used on page load basically
  // like when you refresh the search page for some odd reason
  return {
    searchQuery: state.app.searchQuery
  };
}


export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(SearchBox))
