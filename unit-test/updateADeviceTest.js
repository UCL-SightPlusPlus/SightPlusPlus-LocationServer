var axios = require('axios'),
  assert = require('assert');

var device = require('./deviceInstance');
device.floor = 2;

var req = {
    url: 'http://localhost:3000/devices/2',
    method:'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(device)
}

axios(req)
.then(function(response) {
    assert.equal(response.data.floor, device.floor);
})
