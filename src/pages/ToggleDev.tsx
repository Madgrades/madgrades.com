import Cookies from 'universal-cookie';
import React from 'react';
import { Container } from 'semantic-ui-react';

const ToggleDev: React.FC = () => {
  const cookies = new Cookies();

  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 10);

  const currentValue = cookies.get('user_is_dev') === 'true';

  cookies.set('user_is_dev', !currentValue, {
    path: '/',
    expires: expiration,
  });

  return (
    <Container>
      <p/>
      <p>user_is_dev: {cookies.get('user_is_dev')}</p>
    </Container>
  );
};

export default ToggleDev;
