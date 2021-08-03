'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const updater = require('../schedulers/deviceUpdater');

exports.automaticMessage = async function(beaconId, lastFloor) {
  return new Promise((resolve) => {
    const beacon = updater.deviceTable.find((device) => device._id == beaconId);
    // console.log(beacon);
    if (beacon) {
      const sentences = [];
      // 2 cases: on the same floor or on a different floor
      if (lastFloor && (beacon.floor == lastFloor)) {
        // Return the cameras in the same room as beacon
        console.log('On last floor');
        const deviceInLocation = updater.deviceTable.filter((device) => {
          return device.floor == beacon.floor && (device.deviceLocation == beacon.deviceLocation) && (device.deviceType == 'camera');
        });
        sentences.push(`You are now at the ${beacon.deviceLocation} area. `);
        // get latest record of each device
        Promise.all(deviceInLocation.map(async (device) => {
          await Record.findOne({deviceId: device._id}, (err, record) => {
            if (err) {
              resolve({'status': 400, 'message': err});
            } else {
              sentences.push(createSentenceUsingRecord(record));
            }
          }).sort('-timestamp');
        })).then(() => {
          const response = {'status': 200, 'message': {'floor': beacon.floor, 'sentence': sentences.join('')}};
          resolve(response);
        }).catch((err) => {
          resolve({'status': 400, 'message': err});
        });
      } else {
        // if on a new floor or last floor is not passed(when user first enter a building), return the records of entire floor
        console.log('Not on last floor');
        const deviceOnFloor = updater.deviceTable.filter((device) => device.floor == beacon.floor && (device.deviceType == 'camera'));
        const locations = [...new Set(deviceOnFloor.map((device) => device.deviceLocation))];
        const sentence = `You are now on the ${ordinalSuffixOf(beacon.floor)} floor. On this floor you can find the ${locations.join(' area , the ')} area. `;
        if (locations.length > 1) {
          sentence.substring(0, sentence.lastIndexOf(',')) + `and` + sentence.substring(sentence.lastIndexOf(',')+1, sentence.length);
        }
        sentences.push(sentence);
        locations.map((loc) => {
          const deviceInLocation = deviceOnFloor.filter((device) => device.deviceLocation == loc);
          Promise.all(deviceInLocation.map(async (device) => {
            await Record.findOne({deviceId: device._id}, (err, record) => {
              if (record != null) {
                sentences.push(`In the ${loc} area `);
                sentences.push(createSentenceUsingRecord(record));
              }
            });
          })).then(() => {
            const response = {'floor': beacon.floor, 'sentence': sentences.join('')};
            resolve( {'status': 200, 'message': response});
          }).catch((err) => {
            resolve({'status': 400, 'message': err});
          });
        });
      }
    } else {
      const errResponse = {'message': 'Beacon not found'};
      resolve( {'status': 400, 'message': errResponse});
    }
  });
};

exports.questionMessage = async function(beaconId, lastFloor, recordType) {
// TODO
  return new Promise((resolve) => {
    const beacon = updater.deviceTable.find((device) => device._id == beaconId);
    // console.log(beacon);
    if (beacon) {
      const sentences = [];
      // 2 cases: on the same floor or on a different floor
      if (lastFloor) {
        // Return the cameras in the same room as beacon
        console.log('On last floor');
        const deviceInLocation = updater.deviceTable.filter((device) => {
          return device.floor == beacon.floor && (device.deviceLocation == beacon.deviceLocation) && (device.deviceType == 'camera');
        });
        sentences.push(`You are now at the ${beacon.deviceLocation} area. `);
        // get latest record of each device
        Promise.all(deviceInLocation.map(async (device) => {
          await Record.findOne({deviceId: device._id, recordType: recordType}, (err, record) => {
            if (err) {
              resolve({'status': 400, 'message': err});
            } else {
              record != null ? sentences.push(createSentenceUsingRecord(record)) : null;
            }
          }).sort('-timestamp');
        })).then(() => {
          if (sentences.length < 2 && recordType == 1) {
            sentences.push('There is no information about a queue in this area.');
          } else if (sentences.length < 2 && recordType == 2) {
            sentences.push('There is no information about a seating space in this area.');
          }
          const response = {'status': 200, 'message': {'floor': beacon.floor, 'sentence': sentences.join('')}};
          resolve(response);
        }).catch((err) => {
          resolve({'status': 400, 'message': err});
        });
      }
    } else {
      const errResponse = {'message': 'Beacon not found'};
      resolve( {'status': 400, 'message': errResponse});
    }
  });
};

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
      sentence = `there are ${record.queueing} people in the queue. `;
    } else if (record.recordType == targetId.freeSeats) {
      if (record.freeSeats == 1) {
        sentence = `${record.freeSeats} seat is available. `;
      } else {
        sentence = `${record.freeSeats} seats are available. `;
      }
    } else {
      sentence = `Current event ${record.event}.`;
    };
  };
  return sentence;
};

// eslint-disable-next-line require-jsdoc
function ordinalSuffixOf(i) {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) {
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
}