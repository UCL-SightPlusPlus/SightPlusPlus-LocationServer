'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    _id: {
      type: String,
      required: true
    },
    deviceType: {
      type: String,
      required: true
    },
    deviceLocation: {
      type: String,
      required: true
    },
    site: {
      type: String,
      required: true
    },
    isIndoor: {
      type: Boolean,
      required: true
    },
    floor: {
      type: Number
    },
    maxOccupancy: {
      type: Number
    }
  });

module.exports = mongoose.model('Devices', deviceSchema);
