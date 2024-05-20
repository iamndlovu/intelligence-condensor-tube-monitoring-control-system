import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';

const dbuser = {
  fullName: 'John Doe',
  email: 'john@example.mail',
  password: '12345',
};

const App = () => {
  const [user, setUser] = useState(null);

  const logoutHandler = () => {
    localStorage.removeItem('intelligent-condenser-monitoring-system-user');
    setUser(null);
  };

  useEffect(() => {
    setUser(dbuser);
  }, []);

  return (
    <div className='App'>
      {user ? (
        <Dashboard user={user} logoutHandler={logoutHandler} />
      ) : (
        'logged out'
      )}
    </div>
  );
};

export default App;
