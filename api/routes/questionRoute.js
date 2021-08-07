'use strict';
module.exports = function(app) {
  const controller = require('../controllers/questionController');

  app.route('/questions/:deviceId')
      .post(controller.questionHandler);
};
