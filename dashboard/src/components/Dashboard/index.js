import React, { useState } from 'react';
import PhContainer from '../PhContainer';
import ConductivityContainer from '../ConductivityContainer';
import DissolvedContainer from '../DissolvedContainer';
import Statistics from '../Statistics';
import ExtraInfo from '../Extra';

import styles from './Dashboard.module.scss';
import DataTable from '../DataTable';

const data = [
  {
    ph: { phVal: 2, acidPump: false, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 1,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 3, acidPump: false, alkalinePump: true },
    dissolved: { dissolvedVal: 'normal', heater: false },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 2,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 10, acidPump: true, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 1000, waterPump: false },
    _id: 3,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 2, acidPump: false, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 4,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 3, acidPump: false, alkalinePump: true },
    dissolved: { dissolvedVal: 'normal', heater: false },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 5,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 10, acidPump: true, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 1000, waterPump: false },
    _id: 6,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 2, acidPump: false, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 7,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 3, acidPump: false, alkalinePump: true },
    dissolved: { dissolvedVal: 'normal', heater: false },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 8,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 10, acidPump: true, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 1000, waterPump: false },
    _id: 9,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 2, acidPump: false, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 10,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 3, acidPump: false, alkalinePump: true },
    dissolved: { dissolvedVal: 'normal', heater: false },
    conductivity: { conductivityVal: 10005, waterPump: true },
    _id: 11,
    createdAt: new Date(),
  },
  {
    ph: { phVal: 10, acidPump: true, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', heater: true },
    conductivity: { conductivityVal: 1000, waterPump: false },
    _id: 12,
    createdAt: new Date(),
  },
];

const Dashboard = ({ user, logoutHandler }) => {
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

  const { dissolvedVal, heater } = data[0]
    ? data[0].dissolved
    : {
        dissolvedVal: null,
        heater: null,
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

  const [showTable, setShowTable] = useState(false);

  const toggleTable = () => {
    setShowTable((old) => !old);
  };

  return (
    <div className={styles.Dashboard}>
      <main className={styles.container}>
        {showTable ? (
          <DataTable data={data} toggle={toggleTable} />
        ) : (
          <>
            <section className={`${styles.sectionContainer} ${styles.ph}`}>
              <PhContainer
                phVal={phVal}
                alkalinePump={alkalinePump}
                acidPump={acidPump}
              />
            </section>
            <section
              className={`${styles.sectionContainer} ${styles.dissolved}`}
            >
              <DissolvedContainer
                heater={heater}
                buzzer={heater}
                dissolvedVal={dissolvedVal}
              />
            </section>

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
              <ExtraInfo
                user={user}
                logoutHandler={logoutHandler}
                toggle={toggleTable}
              />
            </section>
          </>
        )}

        <section
          className={`${styles.sectionContainer} ${styles.stats} ${
            showTable && styles.fixed
          }`}
        >
          <Statistics
            avgConductivity={avgConductivity}
            minConductivity={minConductivity}
            maxConductivity={maxConductivity}
            avgPH={avgPH}
            minPH={minPH}
            maxPH={maxPH}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
