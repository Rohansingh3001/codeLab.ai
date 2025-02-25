import React, { useContext } from 'react';
import { UserContext } from '../context/user.context';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default Home;
