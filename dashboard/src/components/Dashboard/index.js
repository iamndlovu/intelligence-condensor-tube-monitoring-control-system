import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PhContainer from '../PhContainer';
import ConductivityContainer from '../ConductivityContainer';
import DissolvedContainer from '../DissolvedContainer';
import Statistics from '../Statistics';
import ExtraInfo from '../Extra';

import styles from './Dashboard.module.scss';
import DataTable from '../DataTable';

const Dashboard = ({ user, logoutHandler }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRes = await axios.get('http://localhost:5000/data');
        setData(dataRes.data);
      } catch (err) {
        console.error(`Failed to fetch data from server:\n\t\t${err}`);
      }
    };

    const fetchDataPeriodically = setInterval(() => fetchData(), 5000);

    return () => {
      clearInterval(fetchDataPeriodically);
    };
  }, []);

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
