const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const user = require('./routes/users');
const data = require('./routes/data');

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//mongoose
mongoose
  .connect(
    'mongodb://127.0.0.1:27017/intelligent-condenser-monitoring-ctrl-system'
  )
  .then(() => console.log('MOngoDB database connected'));

app.get('/', (req, res) =>
  res.json('Hello from Intelligeent Condenser Monitoring & Ctrl Server!')
);

app.post('/secreteID', (req, res) => {
  const superUserID = 'admin';
  const { id } = req.body;
  res.json(id == superUserID);
});

app.post('/test', (req, res) => {
  console.table(req.body);
  res.json(req.body);
});

app.use('/users', user);
app.use('/data', data);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
