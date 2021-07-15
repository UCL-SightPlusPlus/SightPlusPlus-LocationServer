// Need to run first as db is empty
const axios = require('axios');
const assert = require('assert');

const device = require('./deviceInstance');

const req = {
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
