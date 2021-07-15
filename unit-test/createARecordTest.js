// Need to run first as db is empty
var axios = require('axios'),
const assert = require('assert');

var record = require('./recordInstance');

var req = {
    url: 'http://localhost:3000/records',
    method:'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(record)
}

axios(req)
.then(function(response) {
    assert.equal(response.data.timestamp, record.timestamp);
})