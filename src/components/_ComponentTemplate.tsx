import React, { Component } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface TemplateProps {
  example?: number;
}

class TemplateClass extends Component<TemplateProps> {
  componentDidMount = (): void => {
    // const { actions } = this.props;
  };

  render = (): JSX.Element => {
    return <div>Template</div>;
  };
}

const Template: React.FC<TemplateProps> = (props) => {
  const dispatch = useAppDispatch();
  
  return <TemplateClass {...props} />;
};

export default Template;
