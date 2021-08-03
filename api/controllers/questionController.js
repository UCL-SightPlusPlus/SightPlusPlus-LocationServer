'use strict';

const sentenceAdapter = require('../../adapters/sentenceAdapter');

exports.questionHandler = function(req, res) {
  const question = req.body.question;
  // TODO improve this (Maybe some kind of bot that can analyze the question?)
  if (question.includes('queue') || question.includes('line')) {
    sentenceAdapter.questionMessage(req.params.deviceId, req.query.lastFloor, 1).then( (response) =>
      res.status(response.status).json(response.message));
  } else if (question.includes('seats') || question.includes('chairs')) {
    sentenceAdapter.questionMessage(req.params.deviceId, req.query.lastFloor, 2).then( (response) =>
      res.status(response.status).json(response.message));
  }
  // TODO else send to MS QnA Maker
};
