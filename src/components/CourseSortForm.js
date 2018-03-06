import React, {Component} from "react";
import {connect} from "react-redux";
import utils from "../utils";
import {Button, Dropdown, Form} from "semantic-ui-react";
import EntitySelect from "./EntitySelect";
import {withRouter} from "react-router";
import {stringify} from "qs";


const sortOptions = [
  {
    key: 'number',
    text: 'Number (Lowest First)',
    value: 'number'
  },
  {
    key: 'number_desc',
    text: 'Number (Highest First)',
    value: 'number_desc'
  },
  {
    key: 'trending',
    text: 'Trending',
    value: 'trending_recent'
  },
  {
    key: 'dying',
    text: 'Dying',
    value: 'dying'
  },
  {
    key: 'rising_gpa',
    text: 'Rising GPA',
    value: 'rising_gpa'
  },
  {
    key: 'falling_gpa',
    text: 'Falling GPA',
    value: 'falling_gpa'
  }
];


class CourseFilterForm extends Component {
  state = {
    value: 'number'
  };

  componentWillReceiveProps = (nextProps) => {
    const { sort, order } = nextProps.courseFilterParams;
    let value;

    console.log(sort, order);

    if (!sort || sort === 'number') {
      value = 'number';
      if (order === 'desc')
        value = 'number_desc';
    }
    else if (sort === 'trending_recent') {
      value = sort;
      if (order === 'asc')
        value = 'dying';
    }
    else if (sort === 'trending_gpa_recent') {
      value = 'rising_gpa';
      if (order === 'asc')
        value = 'falling_gpa';
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
    else if (value === 'trending_recent') {
      sort = 'trending_recent';
      order = 'desc';
    }
    else if (value === 'dying') {
      sort = 'trending_recent';
      order = 'asc';
    }
    else if (value === 'rising_gpa') {
      sort = 'trending_gpa_recent';
      order = 'desc';
    }
    else if (value === 'falling_gpa') {
      sort = 'trending_gpa_recent';
      order = 'asc';
    }

    const params = {
      ...this.props.courseFilterParams,
      sort,
      order
    };
    this.props.history.push('/courses?' + stringify(params, { encode: false }));
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
