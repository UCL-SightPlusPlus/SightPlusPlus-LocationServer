'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const updater = require('../../schedulers/deviceUpdater');

/**
 * Creates a camera's new record.
 * @param {Object} req - The request sent to POST /records.
 * @param {Object} res - The response the function will generate.
 */
exports.createRecord = function(req, res) {
  const newRecord = new Record(req.body);
  newRecord.save(function(err, record) {
    if (err) {
      res.status(400);
      res.send(err.toString());
    }
    res.json(record);
  });
};
