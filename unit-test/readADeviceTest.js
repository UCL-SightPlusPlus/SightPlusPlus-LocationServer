var axios = require('axios'),
  assert = require('assert');

var device = require('./deviceInstance');

var req = {
    url: 'http://localhost:3000/devices/2',
    method:'GET',
}

axios(req)
.then(function(response) {
    assert.equal(response.data.id, device.id);
})