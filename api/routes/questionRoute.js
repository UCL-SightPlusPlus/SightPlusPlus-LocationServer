'use strict';
module.exports = function(app) {
  const controller = require('../controllers/recordController');

  app.route('questions/:deviceId')
    .post(controller.questionHandler);

};
