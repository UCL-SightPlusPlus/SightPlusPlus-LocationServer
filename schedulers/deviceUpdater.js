const cron = require('node-cron');
const mongoose = require('mongoose');
const Device = mongoose.model('Devices');

/**
 * Starts the scheduler that updates local copy of the devices stored in the MongoDB based on the specified cron expression.
 * @param {Object} deviceCron - The cron expression that specifies when the scheduler will run.
 */
exports.run_scheduler = function(deviceCron) {
  this.updateDeviceTable();
  cron.schedule( deviceCron, () => {
    console.debug('Updating device table...');
    this.updateDeviceTable();
  });
};

/**
 * The function that updates the local copy of the devices stored in the MongoDB.
 */
exports.updateDeviceTable = function getDevices() {
  Device.find({}, function(err, data) {
    if (err) {
      console.error('Could not fetch devices.');
    } else {
      const stringData = JSON.stringify(data);
      const jsonData = JSON.parse(stringData);
      exports.deviceTable = jsonData;
    }
  });
};
