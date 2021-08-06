'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const sentenceAdapter = require('../../adapters/sentenceAdapter');
const qnaAdapter = require('../../adapters/qnaMakerAdapter');

const updater = require('../../schedulers/deviceUpdater');

exports.questionHandler = function(req, res) {
  const question = req.body.question;
  // TODO improve this (Maybe some kind of bot that can analyze the question?)
  if (question.includes('queue') || question.includes('line')) {
    questionMessage(req.params.deviceId, req.query.lastFloor, 1).then( (response) =>
      res.status(response.status).json(response.message));
  } else if (question.includes('seats') || question.includes('chairs')) {
    questionMessage(req.params.deviceId, req.query.lastFloor, 2).then( (response) =>
      res.status(response.status).json(response.message));
  } else {
    const beacon = updater.deviceTable.find((device) => device._id == req.params.deviceId);
    qnaAdapter.generateAnswer(question).then((response) =>
      // eslint-disable-next-line quotes
      res.status(200).json({'floor': beacon.floor, 'sentence': response!=null ? response.answers[0].answer : "I'm sorry, something went wrong"}),
    );
  }
};

async function questionMessage(beaconId, lastFloor, recordType) {
  return new Promise((resolve) => {
    const beacon = updater.deviceTable.find((device) => device._id == beaconId);
    // console.log(beacon);
    if (beacon) {
      const records = [];
      const deviceInLocation = updater.deviceTable.filter((device) => {
        return device.floor == beacon.floor && (device.deviceLocation == beacon.deviceLocation) && (device.deviceType == 'camera');
      });
      // get latest record of each device
      Promise.all(deviceInLocation.map(async (device) => {
        await Record.findOne({deviceId: device._id, recordType: recordType}, (err, record) => {
          if (err) {
            resolve({'status': 400, 'message': err.toString()});
          } else {
            record != null ? records.push(record) : null;
          }
        }).sort('-timestamp');
      })).then(() => {
        const response = {'status': 200, 'message': {'floor': beacon.floor, 'sentence': sentenceAdapter.createSameFloorSentencesFromRecords(beacon, records, recordType)}};
        resolve(response);
      }).catch((err) => {
        resolve({'status': 400, 'message': err.toString()});
      });
    } else {
      const errResponse = {'message': 'Beacon not found'};
      resolve( {'status': 400, 'message': errResponse});
    }
  });
};
