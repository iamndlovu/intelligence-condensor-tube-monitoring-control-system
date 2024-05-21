const router = require('express').Router();
let Data = require('../models/Data.model');

router.route('/').get(async (req, res) => {
  try {
    const dataItems = await Data.find().sort({ createdAt: -1 });
    res.json(dataItems);
  } catch (err) {
    console.error(`Error while fetching data: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/:id').get(async (req, res) => {
  try {
    const dataItem = await Data.findById(req.params.id);
    if (dataItem) res.json(dataItem);
    else {
      console.log(`Object with id ${req.params.id} not found.`);
      res.status(404).json(`Error: Object with id ${req.params.id} not found.`);
    }
  } catch (err) {
    console.error(`Error while fetching data: ${err}`);
    res.status(400).json('Error: ' + err);
  }
});

router.route('/add').post(async (req, res) => {
  const { ph, dissolved, conductivity } = req.body;

  const dataItem = {
    ph,
    dissolved,
    conductivity,
  };

  try {
    const newEntry = new Data(dataItem);
    const response = await newEntry.save();
    res.json(response);
  } catch (err) {
    console.error(`Failed to create new DATA document with error: ${err}`);
    res.status(400).json(`Error ${err}`);
  }
});

router.route('/:id').delete((req, res) => {
  Data.findByIdAndDelete(req.params.id)
    .then(() => res.json('Data deleted'))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
