'use strict';
module.exports = function(app) {
  const controller = require('../controllers/deviceController');

  app.route('/devices')
      .get(controller.listAllDevices)
      .post(controller.createDevice);

  app.route('/devices/:deviceId')
      .get(controller.readDevice)
      .put(controller.updateDevice)
      .delete(controller.deleteDevice);
};
