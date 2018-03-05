import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {withRouter} from "react-router";
import PropTypes from "prop-types"
import {Dropdown} from "semantic-ui-react";

/**
 * A dropdown/searh box for selecting a particular entity from madgrades.
 */
class EntitySelect extends Component {
  static propTypes = {
    entityType: PropTypes.oneOf(['instructor', 'subject']).isRequired,
    onChange: PropTypes.func
  };

  keyToEntity = {};

  state = {
    query: "",
    options: [],
    isFetching: false,
    value: []
  };

  performSearch = (query) => {
    switch (this.props.entityType) {
      case 'instructor':
        this.props.actions.fetchInstructorSearch(query, 1);
        return;
      case 'subject':
        this.props.actions.fetchSubjectSearch(query, 1);
        return;
    }
  };

  entityToKey = (entity) => {
    switch (this.props.entityType) {
      case 'instructor':
        return entity.id;
      case 'subject':
        return entity.code;
    }
  };

  entityToOption = (entity) => {
    switch (this.props.entityType) {
      case 'instructor':
        return {
          key: entity.id,
          value: entity.id,
          text: entity.name
        };
      case 'subject':
        return {
          key: entity.code,
          value: entity.code,
          text: entity.name
        }
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { searches } = nextProps;
    const { query, entityKeys, value } = this.state;
    const pages = searches[query];

    const page = pages && pages[1];

    if (!page)
      return;

    if (page.isFetching) {
      this.setState({
        isFetching: true
      });
      return;
    }

    const { results } = page;



    // current options
    const currOptions = value.map(key => this.keyToEntity[key]);

    // concatenate old options with new found ones
    const searchOptions = results.map(this.entityToOption);

    searchOptions.forEach(option => {
      this.keyToEntity[option.key] = option;
    });

    this.setState({
      isFetching: false,
      options: currOptions.concat(searchOptions)
    });
  };

  onChange = (event, { value }) => {
    console.log(value);
    this.setState({
      value,
      query: "",
      options: value.map(key => this.keyToEntity[key])
    });
  };

  onSearchChange = (event, { searchQuery }) => {
    this.setState({
      query: searchQuery
    });
    this.performSearch(searchQuery);
  };

  render = () => {
    const { options, isFetching, value, query } = this.state;

    return (
        <Dropdown
            placeholder={'Search...'}
            fluid
            multiple
            selection
            loading={isFetching}
            options={options}
            value={value}
            searchQuery={query}
            onChange={this.onChange}
            onSearchChange={this.onSearchChange}
            search/>
    )
  }
}

function mapStateToProps(state, ownProps) {
  const { entityType } = ownProps;

  let searches;

  switch (entityType) {
    case 'instructor':
      searches = state.instructors.searches;
      break;
    case 'subject':
      searches = state.subjects.searches;
      break;
  }

  return {
    searches
  }
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(EntitySelect))
