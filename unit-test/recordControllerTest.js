const axios = require('axios');
const assert = require('assert');

const record = {
  'timestamp': '2012-04-23T18:25:43.511Z',
  'deviceId': 1,
  'targetId': 1,
  'queueing': 7,
};

// Create a record test
let req = {
  url: 'http://localhost:3000/records',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify(record),
};

axios(req)
    .then(function(response) {
      assert.equal(response.data.timestamp, record.timestamp);
    });

// List all records test
req = {
  url: 'http://localhost:3000/records',
  method: 'GET',
};

axios(req)
    .then(function(response) {
      const len = response.data.length;
      assert.equal(response.data[len -1].deviceId, record.deviceId);
    });
