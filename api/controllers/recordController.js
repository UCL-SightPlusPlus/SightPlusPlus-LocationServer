'use strict';

var mongoose = require('mongoose'),
  Record = mongoose.model('Records');

var updater = require('../../schedulers/deviceUpdater');


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

exports.get_all_latest_records_using_floor = async function(req, res) {
  //If floor is null, then return all records
  if(req.query.floor == null){
    Record.find({}, function(err, task) {
      if (err)
        res.send(err);
      res.json(task);
    });
  }
  else {
    //Return all devices on the specified floor
    var devicesOnFloor = updater.deviceTable.filter(function(item) {
      return item.floor == req.query.floor;
    });
  
    var records = []
    //For each on of the devices on the floor, return it's latest record
    try {
      await Promise.all(devicesOnFloor.map(async (device) => {
        await Record.findOne({ deviceId: device._id }, function (err, data) {
          if (err)
            res.send(err);
          records.push(data);
        }).sort('-timestamp');
      }))
      res.json(records);
    } catch (err) {
      res.send(err);
    }
  }

};


exports.get_latest_record_using_floor_targetId = async function(req, res) {
  //Returns all devices on the specified floor
  var devicesOnFloor = updater.deviceTable.filter(function(item) {
    return item.floor == req.query.floor;
  });

  var records = []
  //For each one of devices on the floor, it returns its latest record if the device's targetId is the one specified
  try {
    await Promise.all(devicesOnFloor.map(async (device) => {
      await Record.findOne({ deviceId: device._id , targetId: req.params.targetId}, function (err, data) {
        if (err)
          res.send(err);
        else if(data != null)
          records.push(data);
        console.log(`Task is ${data}`);
      }).sort('-timestamp');
    }))
    res.json(records);
  } catch (err) {
    res.send(err);
  }
};
