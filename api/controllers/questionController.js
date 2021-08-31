'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');

const sentenceAdapter = require('../../adapters/sentenceAdapter');
const qnaAdapter = require('../../adapters/qnaMakerAdapter');

const updater = require('../../schedulers/deviceUpdater');
const keywordExtractor = require('keyword-extractor');

/**
 * Handles questions received from POST /questions.
 * @param {Object} req - The request sent to POST /question.
 * @param {Object} res - The response the function will generate.
 */
exports.questionHandler = function(req, res) {
  const question = req.body.question.toLowerCase();
  const extractionResult = keywordExtractor.extract(question, {
    language: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false});
  // TODO improve this (Maybe some kind of bot that can analyze the question?)
  if (extractionResult.includes('queue') || extractionResult.includes('line')) {
    questionMessage(req.params.deviceId, req.query.lastFloor, 1).then( (response) =>
      res.status(response.status).json(response.message));
  } else if (extractionResult.includes('seats') || extractionResult.includes('chairs')) {
    questionMessage(req.params.deviceId, req.query.lastFloor, 2).then( (response) =>
      res.status(response.status).json(response.message));
  } else if ((question.includes('where') && question.includes('i')) || extractionResult.includes('location')) {
    locationMessage(req.params.deviceId).then( (response) =>
      res.status(response.status).json(response.message));
  } else if (process.env.KB_HOST != '') {
    const beacon = updater.deviceTable.find((device) => device._id == req.params.deviceId);
    qnaAdapter.generateAnswer(question).then((response) => {
      const floor = (typeof beacon === 'undefined') ? null : beacon.floor;
      const sentence = (response != null) ? response.answers[0].answer : 'I\'m sorry, something went wrong';
      res.status(200).json({
        'floor': floor,
        'sentence': sentence,
      });
    });
  } else {
    const beacon = updater.deviceTable.find((device) => device._id == req.params.deviceId);
    res.status(200).json({'floor': ((typeof beacon === 'undefined') ? null : beacon.floor), 'sentence': sentenceAdapter.undefinedSentence()});
  }
};


/**
 * Generate the JSON reply that will be sent back to the user's app if the question asked is about a queue or the empty chairs.
 * @param {string} beaconId - The beacon's ID.
 * @param {string} lastFloor - The last floor the user's was last seen at.
 * @param {int} recordType - The type of record to be searched for the user. 1 for queueing, 2 for empty chairs.
 * @returns {Promise} Promise object represent the JSON reply that will be sent back to the user's app.
 */
// eslint-disable-next-line require-jsdoc
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

/**
 * Generate the JSON reply that will be sent back to the user's app if the question asked is about the user's location.
 * @param {string} beaconId - The beacon's ID.
 * @return {Promise} Promise object represent the JSON reply that will be sent back to the user's app.
 */
async function locationMessage(beaconId) {
  return new Promise((resolve) => {
    const beacon = updater.deviceTable.find((device) => device._id == beaconId);
    if (beacon) {
      const response = {'status': 200, 'message': {'floor': beacon.floor, 'sentence': sentenceAdapter.locationSentence(beacon)}};
      resolve(response);
    } else {
      const errResponse = {'message': 'Beacon not found'};
      resolve( {'status': 400, 'message': errResponse});
    }
  });
}
