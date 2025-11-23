import React from 'react';

type DivProps = React.ComponentProps<'div'>;

function Div(props: DivProps) {
  return <div {...props} />;
}

export default Div;
