const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);
const time = new Date().toISOString();
const sensorId = '999';
const cameraId = '996';
const floor = 999;

describe('Record API', () => {
  before(function () {
    const devices = [
      {
        '_id': sensorId,
        'deviceType': 'sensor',
        'deviceLocation': 'Main entrance',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': floor,
        'maxOccupancy': 50,
      },
      {
        '_id': cameraId,
        'deviceType': 'camera',
        'deviceLocation': 'Main entrance',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': floor,
        'maxOccupancy': 50,
      },
    ];

    chai.request(server)
      .delete('/devices/' + sensorId)
      .end((err, response) => {
        console.log(`Error: ${err}`);
      });

    chai.request(server)
      .delete('/devices/' + cameraId)
      .end((err, response) => {
        console.log(`Error: ${err}`);
      });

    chai.request(server)
      .post('/devices')
      .set('content-type', 'application/json')
      .send(devices[0])
      .end((err, response) => {
        console.log(`Error: ${err}`);
        console.log(`Response: ${response.body.toString()}`);
        chai.request(server)
          .post('/devices')
          .set('content-type', 'application/json')
          .send(devices[1])
          .end((err, response) => {
            console.log(`Error: ${err}`);
            console.log(`Response: ${response.body.toString()}`);
          });
      });

  });
  after(function () {
    chai.request(server)
      .delete('/devices/' + sensorId)
      .end((err, response) => {
        console.log(`Error: ${err}`);
      });
    chai.request(server)
      .delete('/devices/' + cameraId)
      .end((err, response) => {
        console.log(`Error: ${err}`);
      });
  });
  // POST
  describe('Test POST route /records', () => {
    it('It should return a record', (done) => {
      const record = {
        'timestamp': time,
        'deviceId': cameraId,
        'recordType': 1,
        'queueing': 7,
      };
      chai.request(server)
          .post('/records')
          .set('content-type', 'application/json')
          .send(record)
          .end((err, response) => {
            console.log(err);
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('deviceId').eq(cameraId);
            response.body.should.have.property('timestamp').eq(time.toString());
            done();
          });
    });
  });

  // GET
  describe('Test GET route /records', () => {
    it('It should return all records', (done) => {
      chai.request(server)
          .get('/records')
          .end((err, response) => {
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.not.be.eq(0);
            done();
          });
    });
  });

  describe('Test GET /records/:deviceId', () => {
    it('It should return latest records of new room', (done) => {
      const sentence = 'You are in Main entrance.7 people in the queue.';
      chai.request(server)
          .get(`/records/${sensorId}?lastFloor=999`)
          .end((err, response) => {
            console.log(`Error: ${err}`);
            console.log(`Response: ${response.body}`);
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(floor);
            response.body.should.have.property('sentence').eq(sentence);
            done();
          });
    });
    it('It should return latest records of new floor', (done) => {
      const sentence = '999 floor has Main entrance.In Main entrance 7 people in the queue.';
      chai.request(server)
          .get(`/records/${sensorId}?lastFloor=1`)
          .end((err, response) => {
            console.log(`Error: ${err}`);
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(floor);
            response.body.should.have.property('sentence').eq(sentence);
            done();
          });
    });
  });
});