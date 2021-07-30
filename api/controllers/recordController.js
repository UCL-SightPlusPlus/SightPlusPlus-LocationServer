'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const updater = require('../../schedulers/deviceUpdater');

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
  console.log(req.query.lastFloor);
  let response = recordFinder(req.params.deviceId, req.query.lastFloor);
  console.log(response);
  // res.status(status.status).json(response.message);
};

function recordFinder(beaconId, lastFloor){
  console.log(lastFloor);
  console.log(beaconId);
  const beacon = updater.deviceTable.find(device => device._id == beaconId);
  // console.log(beacon);
  if (beacon) {
    console.log(lastFloor)
    if (lastFloor) {
      // console.log(req.query.lastFloor);
      const sentences = [];
      // 2 cases: on the same floor or on a different floor
      if (beacon.floor == lastFloor) {
        // Return the cameras in the same room as beacon
        console.log('On last floor');
        const deviceInLocation = updater.deviceTable.filter(device => {
          return device.floor == beacon.floor && (device.deviceLocation == beacon.deviceLocation) && (device.deviceType == 'camera');
        });
        // console.log(deviceInLocation);
        sentences.push(`You are now on the ${beacon.deviceLocation}.`);
        // console.log(sentences);
        // get latest record of each device
        Promise.all(deviceInLocation.map(async (device) => {
          await Record.findOne({deviceId: device._id}, (err, record) => {
            if (err) {
              return {'status' :400, 'message': err};
            } else {
              // console.log(record);
              sentences.push(createSentenceUsingRecord(record));
            }
          }).sort('-timestamp');
        })).then(() => {
          const response = {'floor': beacon.floor, 'sentence': sentences.join('')};
          return {'status': 200, 'message': response};
        }).catch((err) => {
          return [400, {'message': err}];
        });
      } else {
        console.log('Not on last floor');
        const deviceOnFloor = updater.deviceTable.filter(device => device.floor == beacon.floor && (device.deviceType == 'camera'));
        const locations = [...new Set(deviceOnFloor.map(device => device.deviceLocation))];
        sentences.push(`${beacon.floor} floor has ${locations.join(',')}.`);
        locations.map(loc => {
          let deviceInLocation = deviceOnFloor.filter(device => device.deviceLocation == loc);
          sentences.push(`In ${loc} `);
          Promise.all(deviceInLocation.map(async device => {
            await Record.findOne({deviceId: device._id}, (err, record) => {
              sentences.push(createSentenceUsingRecord(record));
            });
          })).then(() => {
            const response = {'floor': beacon.floor, 'sentence': sentences.join('')};
            return {'status': 200, 'message': response};;
          }).catch((err) => {
            return {'status': 400, 'message': err};
          });
        });
      }
    } else {
      const errResponse = {'message': 'Last floor is not passed'};
      return {'status': 400, 'message': errResponse};
    }
  } else {
    const errResponse = {'message': 'Beacon not found'};
    return {'status': 400, 'message': errResponse};
  }
}

// eslint-disable-next-line require-jsdoc
function createSentenceUsingRecord(record) {
  let sentence = '';
  const targetId = {
    'queueing': 1,
    'freeSeats': 2,
    'event': 3,
  };
  if (record != null) {
    if (record.recordType == targetId.queueing) {
      sentence = `${record.queueing} people in the queue.`;
    } else if (record.targetId == targetId.freeSeats) {
      sentence = `${record.freeSeats} seats is available.`;
    } else {
      sentence = `Current event ${record.event}.`;
    };
  };
  return sentence;
};


