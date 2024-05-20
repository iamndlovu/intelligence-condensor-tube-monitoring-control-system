import React from 'react';

import styles from './Extra.module.scss';

const ExtraInfo = ({ user, logoutHandler }) => {
  const { fullName } = user;
  return (
    <article className={styles.Extra}>
      <header>
        <h1>intelligent condenser monitoring & control system</h1>
        <p>
          <div>
            Logged in as: <span>{fullName.toLowerCase()}</span>
          </div>
          <div>
            <button onClick={() => logoutHandler()}>logout</button>
          </div>
        </p>
      </header>
      <menu>
        <nav>
          <ul>
            <li>
              <button>historical data</button>
            </li>
            <li>
              <button>system users</button>
            </li>
            <li>
              <button>add user</button>
            </li>
          </ul>
        </nav>
      </menu>
    </article>
  );
};

export default ExtraInfo;
