const cron = require('node-cron');
var mongoose = require('mongoose'),
 Device = mongoose.model('Devices');

exports.run_scheduler = function (deviceCron){
  getDevices();
  cron.schedule( deviceCron , () => {
    getDevices();
  })
};

function getDevices(){
  Device.find({}, function(err, data) {
    if (err)
      console.error("Could not fetch devices.");
    var stringData = JSON.stringify(data);
    var jsonData = JSON.parse(stringData);
    exports.deviceTable = jsonData;
  });
}
