'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  deviceLocation: {
    type: String,
    required: true,
  },
  site: {
    type: String,
    required: true,
  },
  isIndoor: {
    type: Boolean,
    required: true,
  },
  floor: {
    type: Number,
  },
  maxOccupancy: {
    type: Number,
  },
});

module.exports = mongoose.model('Devices', deviceSchema);
