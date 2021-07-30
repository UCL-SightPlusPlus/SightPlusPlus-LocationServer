'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const sentenceAdapter = require('../../adapters/sentencesAdapter');

const updater = require('../../schedulers/deviceUpdater');

exports.questionHandler = function(req, res) {
  //This is the question -> req.body
  const question = req.body.question;
  //TODO improve this
  if (question.includes('queue') || question.includes('line')){
    sentenceAdapter.questionMessage(req.params.deviceId, req.query.lastFloor, 1).then( response =>
      res.status(response.status).json(response.message));
  }
  else if(question.includes("seats") || question.includes("chairs")){
    sentenceAdapter.questionMessage(req.params.deviceId, req.query.lastFloor, 2).then( response =>
      res.status(response.status).json(response.message));
  }
};