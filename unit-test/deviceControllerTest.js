const axios = require('axios');
const assert = require('assert');

const device = {
  '_id': 2,
  'deviceType': 'sensor',
  'deviceLocation': 'Main entrance',
  'site': 'GOSH DRIVE',
  'isIndoor': true,
  'floor': 1,
  'maxOccupancy': 50,
};

// Create a device test
let req = {
  url: 'http://localhost:3000/devices',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify(device),
};

axios(req)
    .then(function(response) {
      assert.equal(response.data.id, device.id);
    });

// List all devices test
req = {
  url: 'http://localhost:3000/devices',
  method: 'GET',
};

axios(req)
    .then(function(response) {
      const len = response.data.length;
      assert.equal(response.data[len - 1].id, device.id);
    });

// Read a device
req = {
  url: 'http://localhost:3000/devices/2',
  method: 'GET',
};

axios(req)
    .then(function(response) {
      assert.equal(response.data.id, device.id);
    });

// Update a device test
device.floor = 2;

req = {
  url: 'http://localhost:3000/devices/2',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify(device),
};

axios(req)
    .then(function(response) {
      assert.equal(response.data.floor, device.floor);
    });

// Delete a device test
req = {
  url: 'http://localhost:3000/devices/2',
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify(device),
};

const message = 'Device successfully deleted';

axios(req)
    .then(function(response) {
      assert.equal(response.data.message, message);
    });
