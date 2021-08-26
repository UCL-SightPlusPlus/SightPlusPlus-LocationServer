'use strict';
require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const Device = mongoose.model('Devices');
const updater = require('./deviceUpdater');

const http = require('http');


exports.run_scheduler = function(deviceCron) {
  cron.schedule( deviceCron, () => {
    const dev = [];
    const devices = updater.deviceTable;
    const date = new Date();
    console.info(devices);
    Promise.all(devices.map(async (device) => {
      if (device.deviceType == 'camera') {
        await Record.findOne({'deviceId': device._id}, function(error, record) {
          const d = device;
          if (record != null) {
            const minutes = parseInt(Math.abs(date.getTime() - record.timestamp.getTime()) / 60000);
            if (minutes<2) {
              d.running = true;
            } else {
              d.running =false;
            }
            console.info(`Id: ${device._id}, record date: ${record.timestamp}, minutes: ${minutes}`);
            dev.push(d);
          } else {
            d.running= false;
            dev.push(d);
          }
        }).sort('-timestamp');
      } else {
        dev.push(device);
      }
    })).then(() => {
      console.info(dev);
      // const encodedDevices = new TextEncoder().encode(
      //     JSON.stringify(dev),
      // );
      // const options = {
      //   hostname: process.env.ORG_HOST,
      //   port: process.env.ORG_PORT,
      //   path: '/todos',
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Content-Length': encodedDevices.length,
      //   },
      // };
      // const req = http.request(options, (res) => {
      //   console.log(`statusCode: ${res.statusCode}`);
      //
      //   res.on('data', (d) => {
      //     process.stdout.write(d);
      //   });
      // });
      //
      // req.on('error', (error) => {
      //   console.error(error);
      // });
      //
      // req.write(encodedDevices);
      // req.end();
    });
    // send devices to org server
  });
};
