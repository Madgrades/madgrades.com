import React, { Component } from "react";
import { connect } from "react-redux";
import utils from "../utils";
import { Input } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

class SearchBox extends Component {
  state = {
    searchValue: "",
  };

  componentDidUpdate = (prevProps) => {
    // when we get an outside search value update, reflect that in the
    // search box via the local state
    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.setState({
        searchValue: this.props.searchQuery,
      });
    }
  };

  performSearch = () => {
    const { searchValue } = this.state;

    // tell the app about the search!
    this.props.navigate(`/search?query=${searchValue}`);
  };

  onInputChange = (event, data) => {
    // update the state of the search box to the new value
    this.setState({
      searchValue: data.value,
    });
  };

  onKeyPress = (event) => {
    if (event.key === "Enter") {
      this.performSearch();
      event.target.blur();
    }
  };

  render = () => {
    const { searchValue } = this.state;
    const { className, style, fluid, size, autoFocus } = this.props;

    return (
      <Input
        className={`SearchBox ${className || ''}`}
        style={style || { minWidth: "250px" }}
        value={searchValue}
        onChange={this.onInputChange}
        onKeyPress={this.onKeyPress}
        icon={{
          name: "search",
          link: true,
          onClick: this.performSearch,
          title: "Perform Search",
        }}
        placeholder={this.props.placeholder || "Search..."}
        fluid={fluid === undefined ? true : fluid}
        size={size}
        autoFocus={autoFocus}
      />
    );
  };
}

function mapStateToProps(state) {
  // we grab the app state search query, only used on page load basically
  // like when you refresh the search page for some odd reason
  return {
    searchQuery: state.app.searchQuery,
  };
}

// HOC to inject navigate as prop
function withNavigate(Component) {
  return function ComponentWithNavigate(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

export default connect(
  mapStateToProps,
  utils.mapDispatchToProps
)(withNavigate(SearchBox));
