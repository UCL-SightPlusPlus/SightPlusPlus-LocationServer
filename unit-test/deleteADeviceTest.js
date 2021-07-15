var axios = require('axios'),
const assert = require('assert');

var device = require('./deviceInstance');

var req = {
    url: 'http://localhost:3000/devices/2',
    method:'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(device)
}

axios(req)
.then(function(response) {
    assert.notEqual(response.data.id, device.id);
})