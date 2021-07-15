var request = require('request');
const assert = require('assert');

var device = {
    "_id": 1,
    "deviceType": "camera",
    "deviceLocation": "Main entrance",
    "site": "GOSH DRIVE",
    "isIndoor": true,
    "floor": 1,
    "maxOccupancy": 50
}

var res = {
    url: 'http://localhost:3000/devices',
    method:'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: obj2String(device)
}

request(res, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        assert.equal(device, body)
    }
})


var record = {
    "timestamp": "2012-04-23T18:25:43.511Z",
    "deviceId": 1,
    "targetId": 1,
    "queueing": 7,
    "freeSeats": 2,
    "event": "personIn"
}

var res = {
    url: 'http://localhost:3000/records',
    method:'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: obj2String(record)
}

request(res, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        assert.equal(record, body)
    }
})


