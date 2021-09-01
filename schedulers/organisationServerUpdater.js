'use strict';
require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const updater = require('./deviceUpdater');

const http = require('http');

/**
 * Starts the scheduler that sends the list of devices and their status to the organisation server based on the specified cron expression.
 * Adds a state to the cameras to specify if they are running or not.
 * @param {Object} deviceCron - The cron expression that specifies when the scheduler will run.
 */
exports.run_scheduler = function(deviceCron) {
  cron.schedule( deviceCron, () => {
    const devices = updater.deviceTable;
    this.insertCameraState(devices).then((updatedDevices) => this.sendDevices(updatedDevices));
  });
};

/**
 * Updates the device object by inserting a field called 'running' when the device is a camera.
 * 'running' is 1 if we have received a camera records in the last 2 minutes, otherwise it's 0.
 * @param {Array} devices - The list of devices.
 * @return {Array} The list of devices.
 */
exports.insertCameraState = async function insertCameraState(devices) {
  return new Promise( (resolve) => {
    const updatedDevices = [];
    const date = new Date();
    Promise.all(devices.map(async (device) => {
      if (device.deviceType == 'camera') {
        await Record.findOne({'deviceId': device._id}, function(error, record) {
          const d = device;
          if (record != null) {
            // If it hasn't received a record from a camera in the last 2 minutes, then assume the camera's state is off.
            const minutes = parseInt(Math.abs(date.getTime() - record.timestamp.getTime()) / 60000);
            if (minutes<2) {
              d.running = true;
            } else {
              d.running =false;
            }
            updatedDevices.push(d);
          } else {
            d.running= false;
            updatedDevices.push(d);
          }
        }).sort('-timestamp');
      } else {
        updatedDevices.push(device);
      }
    })).then(() => {
      resolve(updatedDevices);
    });
  });
};

/**
 * Sends the devices to the organisation server
 * @param {Array} devices - The list of devices and their state, that will be sent to the organisation server.
 */
exports.sendDevices = async function sendDevices(devices) {
  const body = {
    'site_name': process.env.SITE,
    'url': `https://www.qnamaker.ai/Edit/KnowledgeBase?kbId=${process.env.KB_ID}`,
    'devices': devices,
  };
  const encodedDevices = new TextEncoder().encode(
      JSON.stringify(body),
  );
  const options = {
    hostname: process.env.ORG_HOST,
    port: process.env.ORG_PORT,
    path: '/profile',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': encodedDevices.length,
    },
  };
  const req = http.request(options, (res) => {
    res.on('data', (d) => {
      console.debug('Devices sent to organisation server successfully');
      return d;
    });
  });
  req.on('error', (error) => {
    console.error('Could not send devices to the organisation server');
    return null;
  });
  req.write(encodedDevices);
  req.end();
};
