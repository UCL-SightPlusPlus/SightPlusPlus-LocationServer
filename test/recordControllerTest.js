const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);
const time = new Date().toISOString();
const sensorId = '999';
const cameraId = '1';

describe('Record API', () => {
  before(function () {
    const devices = [
      {
        '_id': sensorId,
        'deviceType': 'sensor',
        'deviceLocation': 'Main entrance',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 999,
        'maxOccupancy': 50,
      },
      {
        '_id': cameraId,
        'deviceType': 'camera',
        'deviceLocation': 'Main entrance',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 999,
        'maxOccupancy': 50,
      },
    ];

    chai.request(server)
      .delete('/devices/' + sensorId);

    chai.request(server)
      .delete('/devices/' + cameraId);

    devices.forEach(device => {
      chai.request(server)
      .post('/devices')
      .set('content-type', 'application/json')
      .send(device)
      .end((err, response) => {
      });
    });
  });
  after(function () {
    chai.request(server)
      .delete('/devices/' + sensorId);
    chai.request(server)
      .delete('/devices/' + cameraId);
  });
  // POST
  describe('Test POST route /records', () => {
    it('It should return a record', (done) => {
      const record = {
        'timestamp': time,
        'deviceId': cameraId,
        'targetId': 1,
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
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.not.be.eq(0);
            done();
          });
    });

    it('It should return latest records of a floor', (done) => {
      chai.request(server)
        .get('/records?floor=999')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body[0].should.have.property('timestamp').eq(time);
          response.body[0].should.have.property('deviceId').eq(cameraId);
          done();
        });
    });
  });

  // describe("Test GET /records/:recordType", () => {
  //   it('It should return latest records of a floor of a specific recordType', (done) => {
  //     chai.request(server)
  //       .get('/records/1?floor=999')
  //       .end((err, response) => {
  //         response.should.have.status(200);
  //         response.body.should.be.a('array');
  //         response.body.length.should.be.eq(1);
  //         response.body[0].should.have.property('timestamp').eq(time);
  //         response.body[0].should.have.property('deviceId').eq(id);
  //         done();
  //       });
  //   });
  // });

  describe('Test GET /records/:deviceId', () => {
    const currentFloor = 999;
    it('It should return latest records of location', (done) => {
      const sentence = 'You are in Main entrance.7 people in the queue.';
      chai.request(server)
          .get('/records/999?lastFloor=999')
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(currentFloor);
            response.body.should.have.property('sentence').eq(sentence);
            done();
          });
    });
    it('It should return latest records of new floor', (done) => {
      const sentence = '999 floor has Main entrance.In Main entrance 7 people in the queue.';
      chai.request(server)
          .get('/records/999?lastFloor=1')
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(currentFloor);
            response.body.should.have.property('sentence').eq(sentence);
            done();
          });
    });
  });
});
