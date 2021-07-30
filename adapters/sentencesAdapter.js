'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const updater = require('../schedulers/deviceUpdater');

exports.automaticMessage = async function(beaconId, lastFloor) {
  return new Promise(resolve => {
    const beacon = updater.deviceTable.find(device => device._id == beaconId);
    // console.log(beacon);
    if (beacon) {
      if (lastFloor) {
        const sentences = [];
        // 2 cases: on the same floor or on a different floor
        if (beacon.floor == lastFloor) {
          // Return the cameras in the same room as beacon
          console.log('On last floor');
          const deviceInLocation = updater.deviceTable.filter(device => {
            return device.floor == beacon.floor && (device.deviceLocation == beacon.deviceLocation) && (device.deviceType == 'camera');
          });
          sentences.push(`You are now on the ${beacon.deviceLocation} area. `);
          // get latest record of each device
          Promise.all(deviceInLocation.map(async (device) => {
            await Record.findOne({deviceId: device._id}, (err, record) => {
              if (err) {
                resolve({'status' :400, 'message': err});
              } else {
                sentences.push(createSentenceUsingRecord(record));
              }
            }).sort('-timestamp');
          })).then(() => {
            const response = {'status': 200, 'message': {'floor': beacon.floor, 'sentence': sentences.join('')}};
            console.log(response);
            resolve(response);
          }).catch((err) => {
            resolve({'status': 400, 'message': err});
          });
        } else {
          console.log('Not on last floor');
          const deviceOnFloor = updater.deviceTable.filter(device => device.floor == beacon.floor && (device.deviceType == 'camera'));
          const locations = [...new Set(deviceOnFloor.map(device => device.deviceLocation))];
          let sentence = `You are now one the ${ordinalSuffixOf(beacon.floor)} floor. On this floor you can find the ${locations.join(' area , the ')} area. `;
          sentence = sentence.substring(0, sentence.lastIndexOf(',')) + `and` + sentence.substring(sentence.lastIndexOf(',')+1,sentence.length);
          sentences.push(sentence);
          locations.map(loc => {
            let deviceInLocation = deviceOnFloor.filter(device => device.deviceLocation == loc);
            Promise.all(deviceInLocation.map(async device => {
              await Record.findOne({deviceId: device._id}, (err, record) => {
                if(record != null){
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
        const errResponse = {'message': 'Last floor is not passed'};
        resolve({'status': 400, 'message': errResponse});
      }
    } else {
      const errResponse = {'message': 'Beacon not found'};
      resolve( {'status': 400, 'message': errResponse});
    }
  });
}

exports.questionMessage = async function(beaconId, lastFloor, recordType){
//TODO
  return new Promise(resolve => {
    resolve({'status': 200, 'message': 'TODO'});
  });
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
      sentence = `there are ${record.queueing} people in the queue. `;
    } else if (record.recordType == targetId.freeSeats) {
      if(record.freeSeats == 1){
        sentence = `${record.freeSeats} seat is available. `;
      }
      else{
        sentence = `${record.freeSeats} seats are available. `;
      }
    } else {
      sentence = `Current event ${record.event}.`;
    };
  };
  return sentence;
};

function ordinalSuffixOf(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}