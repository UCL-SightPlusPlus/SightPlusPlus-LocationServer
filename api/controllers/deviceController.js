'use strict';


const mongoose = require('mongoose');
const Device = mongoose.model('Devices');

const updater = require('../../schedulers/deviceUpdater');


exports.listAllDevices = function(req, res) {
  Device.find({}, function(err, task) {
    if (err) {
      res.send(err);
    }
    res.json(task);
  });
};

exports.createDevice = function(req, res) {
  const newDevice = new Device(req.body);
  newDevice.save(function(err, device) {
    if (err) {
      res.send(err);
    }
    res.json(device);
  });
  updater.updateDeviceTable();
};

exports.readDevice = function(req, res) {
  Device.findById(req.params.deviceId, function(err, device) {
    if (err) {
      res.send(err);
    }
    res.json(device);
  });
};


exports.updateDevice = function(req, res) {
  Device.findOneAndUpdate({_id: req.params.deviceId}, req.body, {new: true},
      function(err, device) {
        if (err) {
          res.send(err);
        }
        res.json(device);
      });
  updater.updateDeviceTable();
};

exports.deleteDevice = function(req, res) {
  Device.remove({
    _id: req.params.deviceId,
  }, function(err, device) {
    if (err) {
      res.send(err);
    }
    res.json({message: 'Device successfully deleted'});
    updater.updateDeviceTable();
  });
};


