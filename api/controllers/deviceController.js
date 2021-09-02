'use strict';


const mongoose = require('mongoose');
const Device = mongoose.model('Devices');

const updater = require('../../schedulers/deviceUpdater');


/**
 * Generates the JSON reply that will return all the devices stored in the MongoDB.
 * @param {Object} req - The request sent to GET /devices.
 * @param {Object} res - The response the function will generate.
 */
exports.listAllDevices = function(req, res) {
  Device.find({}, function(err, task) {
    if (err) {
      res.status(500).json({'error': err.toString()});
    }
    res.json(task);
  });
};

/**
 * Creates a new device on the MongoDB and generates the JSON reply.
 * @param {Object} req - The request sent to POST /devices.
 * @param {Object} res - The response the function will generate.
 */
exports.createDevice = function(req, res) {
  const newDevice = new Device(req.body);
  newDevice.save(function(err, device) {
    if (err) {
      res.status(400);
      res.send(err);
    }
    updater.updateDeviceTable();
    res.json(device);
  });
};

/**
 * Returns a JSON object with the device's information from the MongoDB.
 * @param {Object} req - The request sent to GET /devices/:deviceId.
 * @param {Object} res - The response the function will generate.
 */
exports.readDevice = function(req, res) {
  Device.findById(req.params.deviceId, function(err, device) {
    if (err) {
      res.send(err);
    } else if (device == null) {
      res.status(404).json({message: 'Device ' + req.params.deviceId + ' does not exist.'});
    } else {
      res.json(device);
    }
  });
};

/**
 * Updates a device's information on the MongoDB.
 * @param {Object} req - The request sent to PUT /devices/:deviceId.
 * @param {Object} res - The response the function will generate.
 */
exports.updateDevice = function(req, res) {
  // Cannot change a device's id.
  delete req.body._id;

  Device.findOneAndUpdate({_id: req.params.deviceId}, req.body, {new: true, useFindAndModify: false},
      function(err, device) {
        if (err) {
          res.status(400).send(err.toString());
        } else if (device == null) {
          res.status('404').json({message: 'Device Id not found'});
        } else {
          updater.updateDeviceTable();
          res.json(device);
        }
      });
};

/**
 * Deletes a device from the MongoDB.
 * @param {Object} req - The request sent to DELETE /devices/:deviceId.
 * @param {Object} res - The response the function will generate.
 */
exports.deleteDevice = function(req, res) {
  Device.deleteOne({
    _id: req.params.deviceId,
  }, function(err, device) {
    if (err) {
      res.status(400).send(err.toString());
    } else if (device.deletedCount == 0) {
      res.status(404).json({message: 'Device ' + req.params.deviceId + ' does not exist.'});
    } else {
      updater.updateDeviceTable();
      res.json({message: 'Device successfully deleted'});
    }
  });
};


