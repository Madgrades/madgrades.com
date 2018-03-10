import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import PropTypes from "prop-types"
import {Dropdown} from "semantic-ui-react";
import _ from "lodash";

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

  performSearch = (query) => {
    switch (this.props.entityType) {
      case 'instructor':
        this.props.actions.fetchInstructorSearch(query, 1);
        return;
      case 'subject':
        this.props.actions.fetchSubjectSearch(query, 1);
        return;
      default:
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
      default:
        return;
    }
  };

  entityToKey = (entity, entityType) => {
    switch (entityType) {
      case 'instructor':
        return entity.id;
      case 'subject':
        return entity.code;
      default:
        return;
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
          };
        default:
          return;
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

    setTimeout(() => {
      if (this.state.query === searchQuery) {
        this.setState({
          isTyping: false
        });
        this.performSearch(searchQuery);
      }
    }, 500);
  };

  componentDidUpdate = () => {
    const { entityType, entityData, searches, value } = this.props;
    const { query } = this.state;

    let searchData;

    if (query.length >= 2) {
      searchData = searches[query] && searches[query][1];
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

    // if we are searching, only show options found in the search
    if (searchData && !searchData.isFetching) {
      let keys = searchData.results.map(e => this.entityToKey(e, entityType));
      options = options.filter(o => keys.includes(o.key) || value.includes(o.key));
    }

    // otherwise the only options are the already selected values
    else {
      options = options.filter(o => value.includes(o.key));
    }

    // only update if options are new, we don't want infinite loop
    if (!_.isEqual(this.state.options, options)) {
      this.setState({
        options
      })
    }
  };

  render = () => {
    const { options, isFetching, isTyping, query } = this.state;
    const { value, entityType } = this.props;

    let message = 'No results found';
    if (query.length < 2)
      message = 'Start typing to see results';
    else if (isTyping)
      message = 'Searching...';

    return (
        <Dropdown
            placeholder={`Search ${entityType}s...`}
            noResultsMessage={message}
            fluid
            minCharacters={0}
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
            search={options => options}/>
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
    default:
      return;
  }

  return {
    searches: entityState.searches,
    entityData: entityState.data
  }
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(EntitySelect)
