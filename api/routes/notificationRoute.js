'use strict';
module.exports = function(app) {
  const controller = require('../controllers/notificationController');

  app.route('/notifications/:deviceId')
      .get(controller.notificationCreation);
};
