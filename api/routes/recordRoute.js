'use strict';
module.exports = function(app) {
  var controller = require('../controllers/recordController');

  app.route('/records')
    .get(controller.get_all_latest_records_using_floor)
    .post(controller.create_a_record);
  
  app.route('/records/:targetId')
    .get(controller.get_latest_record_using_floor_targetId);

};