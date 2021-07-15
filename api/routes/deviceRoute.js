'use strict';
module.exports = function(app) {
  const controller = require('../controllers/deviceController');

  app.route('/devices')
      .get(controller.list_all_devices)
      .post(controller.create_a_device);

  app.route('/devices/:deviceId')
      .get(controller.read_a_device)
      .put(controller.update_a_device)
      .delete(controller.delete_a_device);
};
