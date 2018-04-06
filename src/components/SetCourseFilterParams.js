import {Component} from 'react';
import {connect} from 'react-redux';
import utils from '../utils';
import PropTypes from 'prop-types';

class SetCourseFilterParams extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  setCourseFilterParams = () => {
    const { params, actions } = this.props;
    const { page } = params;
    actions.setCourseFilterParams(params);
    actions.fetchCourseSearch(params, page);
  };

  componentDidMount = this.setCourseFilterParams;

  componentDidUpdate = this.setCourseFilterParams;

  render = () => null;
}

export default connect(null, utils.mapDispatchToProps)(SetCourseFilterParams)
