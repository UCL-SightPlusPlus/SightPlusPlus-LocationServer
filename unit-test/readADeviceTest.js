const axios = require('axios');
const assert = require('assert');

const device = require('./deviceInstance');

const req = {
  url: 'http://localhost:3000/devices/2',
  method: 'GET',
};

axios(req)
    .then(function(response) {
      assert.equal(response.data.id, device.id);
    });
