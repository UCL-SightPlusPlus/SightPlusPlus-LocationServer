const axios = require('axios');
const assert = require('assert');

const device = require('./deviceInstance');
device.floor = 2;

const req = {
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
