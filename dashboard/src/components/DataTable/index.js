import tableStyles from './DataTable.module.scss';

const DataTable = ({ data, toggle }) => {
  return (
    <table className={tableStyles.DataTable}>
      <thead className={tableStyles.tableHead}>
        <tr>
          <td>pH Value</td>
          <td>pH Value Status</td>
          <td>pH Value Action</td>
          <td>Water Conductivity</td>
          <td>Water Conductivity Status</td>
          <td>Water Conductivity Action</td>
          <td>Dissolved Oxygen</td>
          <td>Dissolved Oxygen Action</td>
          <td>Date</td>
        </tr>
        <button onClick={() => toggle()} className={tableStyles.closeBtn}>
          X
        </button>
      </thead>
      <tbody className={tableStyles.tableBody}>
        {data &&
          data.map((item) => {
            const { ph, dissolved, conductivity, createdAt } = item;
            const { phVal, acidPump, alkalinePump } = ph;
            const { dissolvedVal, heater } = dissolved;
            const { conductivityVal, waterPump } = conductivity;

            return (
              <tr>
                <td>{phVal}</td>
                <td>
                  {phVal > 7 ? 'pH High' : phVal < 7 ? 'pH Low' : 'pH Normal'}
                </td>
                <td>
                  Acid Pump {acidPump ? 'ON' : 'OFF'} <br />
                  Alkaline Pump {alkalinePump ? 'ON' : 'OFF'}
                </td>
                <td>{conductivityVal}</td>
                <td>
                  {conductivityVal > 10000
                    ? 'water Conductivity High'
                    : 'water Conductivity Optimal'}
                </td>
                <td>Water Pump {waterPump ? 'ON' : 'OFF'}</td>
                <td>{dissolvedVal}</td>
                <td>Heater {heater ? 'ON' : 'OFF'}</td>
                <td>{new Date(createdAt).toLocaleString()}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default DataTable;
