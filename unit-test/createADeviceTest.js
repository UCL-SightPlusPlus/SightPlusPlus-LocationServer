// Need to run first as db is empty
var axios = require('axios'),
  assert = require('assert');

var device = require('./deviceInstance');

var req = {
    url: 'http://localhost:3000/devices',
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(device)
}

axios(req)
.then(function(response) {
    assert.equal(response.data.id, device.id);
})