const cron = require('node-cron');
const mongoose = require('mongoose');
const Device = mongoose.model('Devices');

exports.run_scheduler = function(deviceCron) {
  this.updateDeviceTable();
  cron.schedule( deviceCron, () => {
    this.updateDeviceTable();
  });
};

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
