'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const updater = require('../../schedulers/deviceUpdater');
const sentenceAdapter = require('../../adapters/sentenceAdapter');


exports.notificationCreation = (req, res) => {
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
      const deviceInLocation = [];
      locations.map((loc) => {
        deviceInLocation.push.apply(deviceInLocation, deviceOnFloor.filter((device) => device.deviceLocation == loc));
      });
      Promise.all(deviceInLocation.map(async (device) => {
        await Record.findOne({deviceId: device._id}, (err, record) => {
          if (record != null) {
            record.newLoc = device.deviceLocation;
            records.push(record);
          }
        });
      })).then(() => {
        const response = {'floor': beacon.floor, 'sentence': sentenceAdapter.createDiffFloorSentencesFromRecords(beacon, records, locations)};
        res.status(200).json(response);
      }).catch((err) => {
        res.status(400).json(err.toString());
      });
    }
  } else {
    const errResponse = {'message': 'Beacon not found'};
    res.status(400).json(errResponse);
  }
};
