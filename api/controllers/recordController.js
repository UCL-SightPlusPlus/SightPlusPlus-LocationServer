'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');


exports.list_all_records = function(req, res) {
  Record.find({}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.create_a_record = function(req, res) {
  const newRecord = new Record(req.body);
  newRecord.save(function(err, record) {
    if (err) {
      res.send(err);
    }
    res.json(record);
  });
};
