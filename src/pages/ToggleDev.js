import Cookies from 'universal-cookie';
import React from "react";
import {Container} from "semantic-ui-react";

const ToggleDev = () => {
  const cookies = new Cookies();

  // set expiration to one year from now
  let expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 10);

  let currentValue = cookies.get('user_is_dev') === 'true';

  // set cookie
  cookies.set('user_is_dev', !currentValue, {
    path: '/',
    expires: expiration,
  });

  return (
      <Container>
        <p/>
        <p>user_is_dev: {cookies.get('user_is_dev')}</p>
      </Container>
  )
};

export default ToggleDev;