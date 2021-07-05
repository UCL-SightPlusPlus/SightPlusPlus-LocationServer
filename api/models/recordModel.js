'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var recordSchema = new Schema({
  timestamp: {
    type: Date,
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  targetId: {
    type: Number,
    enum: [1,2,3],
    required: true
  },
  queueing: {
    type: Number
  },
  freeSeats: Number,
  event: String
})

module.exports = mongoose.model('Records', recordSchema);
