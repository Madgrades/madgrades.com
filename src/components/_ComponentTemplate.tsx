import { connect, ConnectedProps } from 'react-redux';
import utils from '../utils';
import { RootState } from '../types';

interface OwnProps {
  example?: number;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

function Template({ example: _example }: Props) {
  return <div>Template</div>;
}

function mapStateToProps(_state: RootState, _ownProps: OwnProps) {
  return {};
}

const connector = connect(mapStateToProps, utils.mapDispatchToProps);
export default connector(Template);
