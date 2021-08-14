'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const updater = require('../../schedulers/deviceUpdater');

exports.createRecord = async function(req, res) {
  const newRecord = new Record(req.body);
  newRecord.save(function(err, record) {
    if (err) {
      res.status(400);
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
        res.status(400);
        res.send(err);
      }
      res.json(task);
    });
  } else {
    // Return all devices on the specified floor
    const devicesOnFloor = updater.deviceTable.filter(function(item) {
      return item.floor == req.query.floor && (item.deviceType == 'camera');
    });

    const records = [];
    // For each on of the devices on the floor, return it's latest record
    try {
      await Promise.all(devicesOnFloor.map(async (device) => {
        await Record.findOne({deviceId: device._id}, function(err, data) {
          if (err) {
            res.status(400);
            res.send(err);
          }
          if (data != null) {
            records.push(data);
          }
        }).sort('-timestamp');
      }));
      res.json(records);
    } catch (err) {
      res.status(400);
      res.send(err);
    }
  }
};