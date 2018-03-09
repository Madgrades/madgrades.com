import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Dropdown} from "semantic-ui-react";
import {withRouter} from "react-router";
import {stringify} from "qs";

const sortOptions = [
  {
    key: 'relevance',
    text: 'Best Match',
    value: 'relevance'
  },
  {
    key: 'number',
    text: 'Number (Lowest First)',
    value: 'number'
  },
  {
    key: 'number_desc',
    text: 'Number (Highest First)',
    value: 'number_desc'
  }
];


class CourseFilterForm extends Component {
  state = {
    value: 'number'
  };

  componentWillReceiveProps = (nextProps) => {
    const { sort, order } = nextProps.courseFilterParams;
    let value;

    if (!sort) {
      value = 'relevance';
    }
    else if (sort === 'relevance') {
      value = 'relevance'
    }
    else if (sort === 'number') {
      value = 'number';
      if (order === 'desc')
        value = 'number_desc';
    }

    if (value !== this.state.value) {
      this.setState({
        value
      })
    }
  };

  onChange = (event, { value }) => {
    this.setState({
      value
    });

    let sort, order;

    if (value === 'number') {
      sort = 'number';
    }
    else if (value === 'number_desc') {
      sort = 'number';
      order = 'desc';
    }
    else if (value === 'relevance') {
      // nothing to do
    }

    const params = {
      ...this.props.courseFilterParams,
      sort,
      order
    };
    this.props.history.push('/search?' + stringify(params, { encode: false }));
  };


  render = () => {
    const { value } = this.state;

    return (
        <Dropdown
            inline
            direction='left'
            header='Sort options'
            options={sortOptions}
            value={value}
            onChange={this.onChange}/>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    courseFilterParams: state.app.courseFilterParams
  };
}

export default connect(mapStateToProps, utils.mapDispatchToProps)(withRouter(CourseFilterForm))
