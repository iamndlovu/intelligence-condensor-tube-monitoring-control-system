import axios from 'axios';
import React, { useEffect, useState } from 'react';

import styles from './LoginForm.module.scss';
import RegistrationForm from '../registrationForm/RegistrationForm';

const LoginForm = ({ handler }) => {
  const [users, setUsers] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [id, setId] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [superCheck, setSuperCheck] = useState(false);
  useEffect(() => {
    axios.get('http://localhost:5000/users').then((res) => setUsers(res.data));
  });

  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangePwd = (e) => setPassword(e.target.value);
  const onChangeID = (e) => setId(e.target.value);

  const submitForm = (e) => {
    e.preventDefault();

    for (let user of users) {
      if (user.email === email && user.password === password) {
        handler(user);
        return;
      }
    }

    alert('Wrong email or password');
  };

  const checkID = async (e) => {
    e.preventDefault();

    const isIdCorrectRes = await axios.post('http://localhost:5000/secreteID', {
      id,
    });
    setId('');
    const isIdCorrect = isIdCorrectRes.data;
    if (isIdCorrect) {
      setShowRegister(true);
      handler({ level: 0, temp: true });
      return;
    }

    alert('ERROR: \nWrong ID');
  };

  return (
    <>
      {showRegister ? (
        <RegistrationForm />
      ) : superCheck ? (
        <form form className={styles.LoginForm} onSubmit={checkID}>
          <div className={styles.formGroup}>
            <label htmlFor='superID' className={styles.offscreen}>
              Enter Super User ID to proceed
            </label>
            <input
              type='password'
              name='superID'
              id='superID'
              placeholder='Super User ID'
              value={id}
              onChange={onChangeID}
              required
            />
          </div>
          <input type='submit' value='Submit' />
          <br />
          <br />
          <div>
            <span
              style={{
                color: 'hsl(216, 96%, 40%)',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => setSuperCheck((oldState) => !oldState)}
            >
              Back to LOGIN
            </span>
          </div>
        </form>
      ) : (
        <form className={styles.LoginForm} onSubmit={submitForm}>
          <div className={styles.formGroup}>
            <label htmlFor='email' className={styles.offscreen}>
              Your email address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              value={email}
              onChange={onChangeEmail}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='password' className={styles.offscreen}>
              Your password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Password'
              value={password}
              onChange={onChangePwd}
              required
            />
          </div>

          <input type='submit' value='LOGIN' />
          <br />
          <br />
          <div>
            <span
              style={{
                color: 'hsl(216, 96%, 40%)',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => setSuperCheck((oldState) => !oldState)}
            >
              Click here to register new user
            </span>
          </div>
        </form>
      )}
    </>
  );
};

export default LoginForm;
