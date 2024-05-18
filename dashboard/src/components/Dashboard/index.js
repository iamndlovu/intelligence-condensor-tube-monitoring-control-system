import React from 'react';
import PhContainer from '../PhContainer';

import styles from './Dashboard.module.scss';

const Dashboard = ({ ph }) => {
  const { phVal, acidPump, alkalinePump } = ph;

  return (
    <div className={styles.Dashboard}>
      <main className={styles.container}>
        <section className={`${styles.sectionContainer} ${styles.ph}`}>
          <PhContainer
            phVal={phVal}
            alkalinePump={alkalinePump}
            acidPump={acidPump}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
