'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const updater = require('../../schedulers/deviceUpdater');
const sentenceAdapter = require('../../adapters/sentenceAdapter')

exports.createRecord = function(req, res) {
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
          if(data != null) {
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
          res.status(400);
          res.send(err);
        } else if (data != null) {
          records.push(data);
        }
      }).sort('-timestamp');
    }));
    res.json(records);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
};

exports.getLatestRecordByBeacon = (req, res) => {
  const beacon = updater.deviceTable.find((device) => device._id == req.params.deviceId);
  // console.log(beacon);
  if (beacon) {
    const records = [];
    // 2 cases: on the same floor or on a different floor
    if (req.query.lastFloor && (beacon.floor == req.query.lastFloor)) {
      // Return the cameras in the same room as beacon
      console.log('On last floor');
      const deviceInLocation = updater.deviceTable.filter((device) => {
        return device.floor == beacon.floor && (device.deviceLocation == beacon.deviceLocation) && (device.deviceType == 'camera');
      });
      // get latest record of each device
      Promise.all(deviceInLocation.map(async (device) => {
        await Record.findOne({deviceId: device._id}, (err, record) => {
          if (err) {
            res.status(400).json(err);
          } else {
            records.push(record);
          }
        }).sort('-timestamp');
      })).then(() => {
        const response = {'floor': beacon.floor, 'sentence': sentenceAdapter.createSameFloorSentencesFromRecords(beacon, records)};
        res.status(200).json(response);
      }).catch((err) => {
        res.status(400).json(err);
      });
    } else {
      // if on a new floor or last floor is not passed(when user first enter a building), return the records of entire floor
      console.log('Not on last floor');
      const deviceOnFloor = updater.deviceTable.filter((device) => device.floor == beacon.floor && (device.deviceType == 'camera'));
      const locations = [...new Set(deviceOnFloor.map((device) => device.deviceLocation))];
      locations.map((loc) => {
        const deviceInLocation = deviceOnFloor.filter((device) => device.deviceLocation == loc);
        Promise.all(deviceInLocation.map(async (device) => {
          await Record.findOne({deviceId: device._id}, (err, record) => {
            if (record != null) {
              record.newLoc = loc;
              records.push(record);
            }
          });
        })).then(() => {
          const response = {'floor': beacon.floor, 'sentence': sentenceAdapter.createDiffFloorSentencesFromRecords(beacon, records, locations)};
          res.status(200).json(response);
        }).catch((err) => {
          res.status(400).json(err);
        });
      });
    }
  } else {
    const errResponse = {'message': 'Beacon not found'};
    res.status(400).json(errResponse);
  }
};
