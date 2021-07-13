var axios = require('axios'),
  assert = require('assert');

var device = require('./deviceInstance');

var req = {
    url: 'http://localhost:3000/devices',
    method:'GET',
}

axios(req)
.then(function(response) {
    assert.equal(response.data[1].id, device.id);
})
