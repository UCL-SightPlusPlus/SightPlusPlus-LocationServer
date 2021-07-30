'use strict';

const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const recordController = require('recordController');

const updater = require('../../schedulers/deviceUpdater');

exports.questionHandler = function(req, res) {
  //This is the question -> req.body
  const question = req.body;
  If (question.includes('queue') || question.includes('line')){
    // recordController.
  }

};