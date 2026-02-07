import React from 'react';
import { Container } from 'semantic-ui-react';

const NotFound: React.FC = () => {
  document.title = 'Not Found - Madgrades';

  return (
    <Container text textAlign='center'>
      <p></p>
      <h1>Page not found...</h1>
    </Container>
  );
};

export default NotFound;
