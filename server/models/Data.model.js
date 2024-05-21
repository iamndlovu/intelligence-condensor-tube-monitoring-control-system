const { Schema, model } = require('mongoose');

const DataSchema = new Schema(
  {
    ph: {
      type: Object,
      default: { phVal: null, acidPump: null, alkalinePump: null },
    },
    dissolved: { type: Object, default: { dissolvedVal: null, heater: null } },
    conductivity: {
      type: Object,
      default: { conductivityVal: null, waterPump: null },
    },
  },
  { timestamps: true }
);

const Data = model('Data', DataSchema);

module.exports = Data;
