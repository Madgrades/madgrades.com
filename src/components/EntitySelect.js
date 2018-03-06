import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types"
import {Dropdown} from "semantic-ui-react";

/**
 * A dropdown/search box for selecting a particular entity from madgrades.
 *
 * This is pretty fragile, easy to create infinite loops... :(
 */
class EntitySelect extends Component {
  static propTypes = {
    entityType: PropTypes.oneOf(['instructor', 'subject']).isRequired,
    onChange: PropTypes.func,
    value: PropTypes.array
  };

  static defaultProps = {
    value: []
  };

  state = {
    query: "",
    options: [],
    isTyping: false,
    isFetching: false
  };

  clear = () => {
    this.setState({
      query: '',
      isFetching: false,
      isTyping: false
    });
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

  requestEntity = (key, entityType) => {
    switch (entityType) {
      case 'instructor':
        this.props.actions.fetchInstructor(key);
        return;
      case 'subject':
        this.props.actions.fetchSubject(key);
        return;
    }
  };

  entityToKey = (entity, entityType) => {
    switch (entityType) {
      case 'instructor':
        return entity.id;
      case 'subject':
        return entity.code;
    }
  };

  entityToOption = (key, entity, entityType) => {
    if (entity.isFetching) {
      return {
        key: key,
        value: key,
        text: `${key} (Loading...)`
      }
    }
    else {
      switch (entityType) {
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
    }
  };

  onChange = (event, { value }) => {
    this.setState({
      query: ""
    });
    this.props.onChange(value);
  };

  onSearchChange = (event, { searchQuery }) => {
    this.setState({
      query: searchQuery,
      isTyping: true
    });

    if (searchQuery.length < 2)
      return;

    setTimeout(() => {
      if (this.state.query === searchQuery) {
        this.setState({
          isFetching: true,
          isTyping: false
        });
        this.performSearch(searchQuery);
      }
    }, 500);
  };

  componentWillReceiveProps = (nextProps) => {
    const { entityType, entityData, searches, value } = nextProps;
    const { query } = this.state;

    let isFetching = false;

    if (query.length >= 2) {
      isFetching = searches[query] &&
          searches[query] &&
          searches[query][1].isFetching;
    }

    let options = [];
    let keys = new Set();

    for (let keyStr of Object.keys(entityData)) {
      let entity = entityData[keyStr];
      let key = this.entityToKey(entity, entityType);
      options.push(this.entityToOption(key, entity, entityType));
      keys.add(key);
    }

    for (let key of value) {
      if (!keys.has(key)) {
        options.push({
          key: key,
          value: key,
          text: `${key} (Loading...)`
        });
        this.requestEntity(key, entityType);
        keys.add(key);
      }
    }

    this.setState({
      options,
      isFetching
    })
  };

  render = () => {
    const { options, isFetching, isTyping, query } = this.state;
    const { value } = this.props;

    let message = 'No results found';
    if (query.length < 2)
      message = 'Start typing to see results';
    else if (isTyping)
      message = 'Searching...';

    return (
        <Dropdown
            placeholder={'Search...'}
            noResultsMessage={message}
            fluid
            multiple
            scrolling={false}
            selection
            closeOnChange={true}
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

  let entityState;

  switch (entityType) {
    case 'instructor':
      entityState = state.instructors;
      break;
    case 'subject':
      entityState = state.subjects;
      break;
  }

  return {
    searches: entityState.searches,
    entityData: entityState.data
  }
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(EntitySelect)
