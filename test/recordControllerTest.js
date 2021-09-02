const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
const time = new Date().toISOString();
const sensorId = '999';
const cameraId = '996';
const floor = 999;

describe('Record API', () => {
  before(function() {
    const devices = [
      {
        '_id': sensorId,
        'deviceType': 'BLE',
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

    return new Promise((resolve) =>{
      chai.request(server)
          .post('/devices')
          .set('content-type', 'application/json')
          .send(devices[0])
          .end((err, response) => {
            resolve();
          });
    });
  });
  after(function() {
    chai.request(server)
        .delete('/devices/' + sensorId)
        .end((err, response) => {
        });
    chai.request(server)
        .delete('/devices/' + cameraId)
        .end((err, response) => {
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
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('deviceId').eq(cameraId);
            response.body.should.have.property('timestamp').eq(time.toString());
            done();
          });
    });

    it('It should return an error', (done) => {
      const record = {
        'deviceId': cameraId,
        'recordType': 1,
        'queueing': 7,
      };
      chai.request(server)
          .post('/records')
          .set('content-type', 'application/json')
          .send(record)
          .end((err, response) => {
            response.should.have.status(400);
            done();
          });
    });
  });

  describe('Test GET /records/:deviceId', () => {
    before( function() {
      return new Promise((resolve) =>{
        chai.request(server)
            .post('/devices')
            .set('content-type', 'application/json')
            .send({
              '_id': cameraId,
              'deviceType': 'camera',
              'deviceLocation': 'Main entrance',
              'site': 'GOSH DRIVE',
              'isIndoor': true,
              'floor': floor,
              'maxOccupancy': 50,
            })
            .end((err, response) => {
              resolve();
            });
      });
    });

    it('It should return latest records of new room', (done) => {
      const sentence = 'You are now at the Main entrance area. there are 7 people in the queue. ';
      chai.request(server)
          .get(`/notifications/${sensorId}?lastFloor=999`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(floor);
            response.body.should.have.property('sentence').eq(sentence);
            done();
          });
    });
    it('It should return latest records of new floor', (done) => {
      const sentence = 'You are now on the 999th floor. On this floor you can find the Main entrance area. ';
      chai.request(server)
          .get(`/notifications/${sensorId}?lastFloor=1`)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(floor);
            response.body.should.have.property('sentence').eq(sentence);
            done();
          });
    });
  });
});
