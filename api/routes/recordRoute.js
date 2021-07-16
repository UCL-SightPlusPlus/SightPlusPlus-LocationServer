'use strict';
module.exports = function(app) {
  const controller = require('../controllers/recordController');

  app.route('/records')
    .get(controller.getAllLatestRecordsUsingFloor)
    .post(controller.createRecord);
  
  app.route('/records/:targetId')
    .get(controller.getLatestRecordUsingFloorTargetId);

};
