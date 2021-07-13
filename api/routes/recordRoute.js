'use strict';
module.exports = function(app) {
  var controller = require('../controllers/recordController');

  app.route('/records')
    .get(controller.list_all_records)
    .post(controller.create_a_record);

  app.route('/records/:recordId')
    .get(controller.read_a_record);

};