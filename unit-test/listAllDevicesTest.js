const axios = require('axios');
const assert = require('assert');

const device = require('./deviceInstance');

const req = {
  url: 'http://localhost:3000/devices',
  method: 'GET',
};

axios(req)
    .then(function(response) {
      assert.equal(response.data[1].id, device.id);
    });
