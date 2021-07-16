'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const updater = require('../../schedulers/deviceUpdater');


exports.listAllRecords = function(req, res) {
  Record.find({}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.createRecord = function(req, res) {
  const newRecord = new Record(req.body);
  newRecord.save(function(err, record) {
    if (err) {
      res.send(err);
    }
    res.json(record);
  });
};

exports.getAllLatestRecordsUsingFloor = async function(req, res) {
  // If floor is null, then return all records
  if (req.query.floor == null) {
    Record.find({}, function(err, task) {
      if (err) {
        res.send(err);
      }
      res.json(task);
    });
  } else {
    // Return all devices on the specified floor
    const devicesOnFloor = updater.deviceTable.filter(function(item) {
      return item.floor == req.query.floor;
    });

    const records = [];
    // For each on of the devices on the floor, return it's latest record
    try {
      await Promise.all(devicesOnFloor.map(async (device) => {
        await Record.findOne({deviceId: device._id}, function(err, data) {
          if (err) {
            res.send(err);
          }
          records.push(data);
        }).sort('-timestamp');
      }));
      res.json(records);
    } catch (err) {
      res.send(err);
    }
  }
};

exports.getLatestRecordUsingFloorRecordType = async function(req, res) {
  // Returns all devices on the specified floor
  const devicesOnFloor = updater.deviceTable.filter(function(item) {
    return item.floor == req.query.floor;
  });

  const records = [];
  // For each one of devices on the floor,
  // it returns its latest record if the device's recordType is the one specified
  try {
    await Promise.all(devicesOnFloor.map(async (device) => {
      await Record.findOne({deviceId: device._id, recordType: req.params.recordType}, function(err, data) {
        if (err) {
          res.send(err);
        } else if (data != null) {
          records.push(data);
        }
      }).sort('-timestamp');
    }));
    res.json(records);
  } catch (err) {
    res.send(err);
  }
};
