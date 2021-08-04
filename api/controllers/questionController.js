'use strict';

const sentenceAdapter = require('../../adapters/sentenceAdapter');
const qnaAdapter = require('../../adapters/qnaMakerAdapter');

const updater = require('../../schedulers/deviceUpdater');

exports.questionHandler = function(req, res) {
  const question = req.body.question;
  // TODO improve this (Maybe some kind of bot that can analyze the question?)
  if (question.includes('queue') || question.includes('line')) {
    sentenceAdapter.questionMessage(req.params.deviceId, req.query.lastFloor, 1).then( (response) =>
      res.status(response.status).json(response.message));
  } else if (question.includes('seats') || question.includes('chairs')) {
    sentenceAdapter.questionMessage(req.params.deviceId, req.query.lastFloor, 2).then( (response) =>
      res.status(response.status).json(response.message));
  } else {
    const beacon = updater.deviceTable.find((device) => device._id == req.params.deviceId);
    qnaAdapter.generateAnswer(question).then((response) =>
        res.status(200).json({'floor': beacon.floor, 'sentence': response!=null ? response.answers[0].answer : "I'm sorry, something went wrong"})
      );
  }
};
