import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import LoginForm from './components/loginForm/LoginForm';

const Login = ({ handler }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100vh',
    }}
  >
    <header
      style={{
        backgroundColor: 'black',
        color: 'white',
        padding: '1rem 2rem',
        textAlign: 'center',
      }}
    >
      <h1>intelligent condenser monitoring & control system</h1>
    </header>

    <main
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <section
        style={{
          width: '45rem',
          margin: 'auto',
        }}
      >
        <LoginForm handler={handler} />
      </section>
    </main>

    <footer
      style={{
        padding: '1rem 2rem',
        borderTop: '1px solid #333',
      }}
    >
      <p
        style={{
          textAlign: 'center',
        }}
      >
        &copy; {new Date().getFullYear()} CompanyName. All Rights Reserved
      </p>
    </footer>
  </div>
);

const App = () => {
  const [user, setUser] = useState(null);

  const logoutHandler = () => {
    localStorage.removeItem('intelligent-condenser-monitoring-system-user');
    setUser(null);
  };

  const loginHandler = (user) => {
    localStorage.setIItem(
      'intelligent-condenser-monitoring-system-user',
      JSON.stringify(user)
    );
    setUser(user);
  };

  useEffect(() => {
    const localUser = localStorage.getItem(
      'intelligent-condenser-monitoring-system-user'
    );

    if (localUser) {
      setUser(JSON.parse(localUser));
    }
  }, []);

  return (
    <div className='App'>
      {user ? (
        <Dashboard user={user} logoutHandler={logoutHandler} />
      ) : (
        <Login handler={loginHandler} />
      )}
    </div>
  );
};

export default App;
