'use strict';
module.exports = function(app) {
  const controller = require('../controllers/recordController');

  app.route('/records')
      .post(controller.createRecord);
};
