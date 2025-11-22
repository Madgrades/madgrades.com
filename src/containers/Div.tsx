import React from 'react';

interface DivProps {
  [key: string]: any;
}

const Div: React.FC<DivProps> = (props) => <div {...props} />;

export default Div;