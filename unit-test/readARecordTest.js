var axios = require('axios'),
const assert = require('assert');

var record = require('./recordInstance');

var req = {
    url: 'http://localhost:3000/records/2',
    method:'GET',
}

axios(req)
.then(function(response) {
    assert.equal(response.data.timestamp, record.timestamp);
})