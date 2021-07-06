'use strict';


var mongoose = require('mongoose'),
  Record = mongoose.model('Records');


exports.list_all_records = function(req, res) {
    Record.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
};

exports.create_a_record = function(req, res) {
    var new_record = new Record(req.body);
    new_record.save(function(err, record) {
      if (err)
        res.send(err);
      res.json(record);
    });
};

