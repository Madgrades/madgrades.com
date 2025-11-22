import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState, Subject } from '../types';

interface OwnProps {
  code: string;
  abbreviate?: boolean;
  fallback?: string;
  data?: Subject;
}

interface StateProps {
  name?: string;
  abbreviation?: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & StateProps & PropsFromRedux;

class SubjectName extends Component<Props> {
  componentDidMount = () => {
    const { actions, code, data } = this.props;

    if (!data && code) {
      actions.fetchSubject(code);
    }
  };

  render = () => {
    const { name, abbreviation, abbreviate, fallback } = this.props;

    const text = abbreviate ? abbreviation : name;
    return <span>{text || fallback}</span>;
  };
}

function mapStateToProps(state: RootState, ownProps: OwnProps): StateProps {
  const { code, data } = ownProps;

  if (data) {
    return {
      name: data.name,
      abbreviation: data.abbreviation,
    };
  }

  const { subjects } = state;
  const subjectData = subjects.data[code];

  return {
    name: subjectData && subjectData.name,
    abbreviation: subjectData && subjectData.abbreviation,
  };
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(SubjectName);
