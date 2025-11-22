import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import _ from 'lodash';
import { CourseFilterParams } from '../types';

interface OwnProps {
  params: CourseFilterParams;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

class SetCourseFilterParams extends Component<Props> {
  setCourseFilterParams = () => {
    const { params, actions } = this.props;
    const { page } = params;
    actions.setCourseFilterParams(params);
    actions.fetchCourseSearch(params, page);
  };

  componentDidMount = this.setCourseFilterParams;

  componentDidUpdate = (prevProps: Props) => {
    if (!_.isEqual(prevProps.params, this.props.params)) {
      this.setCourseFilterParams();
    }
  };

  render = () => null;
}

const connector = connect(null, utils.mapDispatchToProps);
export default connector(SetCourseFilterParams);
