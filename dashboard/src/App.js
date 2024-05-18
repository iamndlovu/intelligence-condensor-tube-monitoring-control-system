import Dashboard from './components/Dashboard';

const data = [
  {
    ph: { phVal: 7, acidPump: false, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', buzzer: true, Na2SO4: true },
    conductivity: { conductivityVal: 1000, pump: false },
  },
  {
    ph: { phVal: 3, acidPump: false, alkalinePump: true },
    dissolved: { dissolvedVal: 'low', buzzer: false, Na2SO4: false },
    conductivity: { conductivityVal: 1005, pump: true },
  },
  {
    ph: { phVal: 10, acidPump: true, alkalinePump: false },
    dissolved: { dissolvedVal: 'high', buzzer: true, Na2SO4: true },
    conductivity: { conductivityVal: 1000, pump: false },
  },
];

const App = () => {
  const { ph, dissolved, conductivity } = data[0];
  return (
    <div className='App'>
      <Dashboard ph={ph} dissolved={dissolved} conductivity={conductivity} />
    </div>
  );
};

export default App;
