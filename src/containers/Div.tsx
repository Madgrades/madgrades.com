import React from 'react';

const Div: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div {...props} />
);

export default Div;
