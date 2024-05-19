import React from 'react';
import PhContainer from '../PhContainer';

import styles from './Dashboard.module.scss';
import ConductivityContainer from '../ConductivityContainer';

const data = [
  {
    ph: { phVal: 2, acidPump: false, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', buzzer: true, Na2SO4Pump: true },
    conductivity: { conductivityVal: 1005, waterPump: true },
    _id: 1,
  },
  {
    ph: { phVal: 3, acidPump: false, alkalinePump: true },
    dissolved: { dissolvedVal: 'low', buzzer: false, Na2SO4Pump: false },
    conductivity: { conductivityVal: 1005, waterPump: true },
    _id: 2,
  },
  {
    ph: { phVal: 10, acidPump: true, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', buzzer: true, Na2SO4Pump: true },
    conductivity: { conductivityVal: 1000, waterPump: false },
    _id: 3,
  },
];

const Dashboard = () => {
  const { _id } = data[0]
    ? data[0]
    : {
        _id: `${Math.random()}${new Date().getFullYear()}${new Date().getMonth()}${new Date().getDay()}`,
      };
  const { phVal, acidPump, alkalinePump } = data[0]
    ? data[0].ph
    : {
        phVal: null,
        acidPump: null,
        alkalinePump: null,
      };

  const { dissolvedVal, buzzer, Na2SO4Pump } = data[0]
    ? data[0].dissolved
    : {
        dissolvedVal: null,
        buzzer: null,
        Na2SO4Pump: null,
      };

  const { conductivityVal, waterPump } = data[0]
    ? data[0].conductivity
    : {
        conductivityVal: null,
        waterPump: null,
      };

  const avgPH = Number(
    (
      data.map((entry) => entry.ph.phVal).reduce((a, b) => a + b, 0) /
      data.length
    ).toFixed(1)
  );

  const avgConductivity = Number(
    (
      data
        .map((entry) => entry.conductivity.conductivityVal)
        .reduce((a, b) => a + b, 0) / data.length
    ).toFixed(1)
  );

  const minPH = data
    .map((entry) => entry.ph.phVal)
    .reduce((a, b) => (a < b ? a : b), Infinity);

  const minConductivity = data
    .map((entry) => entry.conductivity.conductivityVal)
    .reduce((a, b) => (a < b ? a : b), Infinity);

  const maxPH = data
    .map((entry) => entry.ph.phVal)
    .reduce((a, b) => (a > b ? a : b), -Infinity);

  const maxConductivity = data
    .map((entry) => entry.conductivity.conductivityVal)
    .reduce((a, b) => (a > b ? a : b), -Infinity);

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
        <section
          className={`${styles.sectionContainer} ${styles.dissolved}`}
        ></section>

        <section
          className={`${styles.sectionContainer} ${styles.conductivity}`}
        >
          <ConductivityContainer
            conductivityVal={conductivityVal}
            waterPump={waterPump}
            id={_id}
            minConductivity={minConductivity}
            maxConductivity={maxConductivity}
          />
        </section>

        <section className={`${styles.sectionContainer} ${styles.extra}`}>
          <header>
            <h1>intelligent condenser monitoring & control system</h1>
            <p>logged in as: John Doe</p>
            <p>
              <button>logout</button>
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
        </section>

        <section className={`${styles.sectionContainer} ${styles.stats}`}>
          <h1>statistics</h1>
          <div>
            <article>
              <h2>pH</h2>
              <ul>
                <li>
                  <span>Average - </span>
                  <span>{avgPH}</span>
                </li>
                <li>
                  <span>Minimum - </span>
                  <span>{minPH}</span>
                </li>
                <li>
                  <span>Maximum - </span>
                  <span>{maxPH}</span>
                </li>
              </ul>
            </article>
            <article>
              <h2>Conductivity</h2>
              <ul>
                <li>
                  <span>Average - </span>
                  <span>{avgConductivity}</span>
                </li>
                <li>
                  <span>Minimum - </span>
                  <span>{minConductivity}</span>
                </li>
                <li>
                  <span>Maximum - </span>
                  <span>{maxConductivity}</span>
                </li>
              </ul>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
