const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
const time = new Date().toISOString();
const sensorId = '995';
const cameraId = '994';
const floor = 998;

describe('Question APIs', () => {
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
    ];

    return new Promise((resolve) => {
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
  describe('Test POST route /questions/:deviceId', () => {
    before(function() {
      return new Promise((resolve) => {
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

    before(function() {
      return new Promise((resolve) => {
        chai.request(server)
            .post('/records')
            .set('content-type', 'application/json')
            .send({
              'timestamp': time,
              'deviceId': cameraId,
              'recordType': 1,
              'queueing': 5,
            })
            .end((err, response) => {
              resolve();
            });
      });
    });

    it('It should return information about a queue', (done) => {
      chai.request(server)
          .post(`/questions/${sensorId}`)
          .set('content-type', 'application/json')
          .send({
            'question': 'How many people are in the queue?',
          })
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('sentence').eq('You are now at the Main entrance area. there are 5 people in the queue. ');
            done();
          });
    });

    it('It should return information about empty seats', (done) => {
      chai.request(server)
          .post(`/questions/${sensorId}`)
          .set('content-type', 'application/json')
          .send({
            'question': 'How many chairs are available?',
          })
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('sentence').eq('You are now at the Main entrance area. There is no information about a seating space in this area.');
            done();
          });
    });

    it('It should return information about the user\'s location', (done) => {
      chai.request(server)
          .post(`/questions/${sensorId}`)
          .set('content-type', 'application/json')
          .send({
            'question': 'Where am I?',
          })
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('sentence').eq('You are now at the Main entrance area on the 998th floor');
            done();
          });
    });
    it('It should return information about when the location is open', (done) => {
      chai.request(server)
          .post(`/questions/${sensorId}`)
          .set('content-type', 'application/json')
          .send({
            'question': 'What time do you open?',
          })
          .end((err, response) => {
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('sentence').eq('The location is open everyday from 9am to 6pm');
            done();
          });
    });

    it('It should return an undefined question when the beacon is correct', (done) => {
      process.env.KB_ID = '123';
      chai.request(server)
          .post(`/questions/${sensorId}`)
          .set('content-type', 'application/json')
          .send({
            'question': 'What time do you open?',
          })
          .end((err, response) => {
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(floor);
            response.body.should.have.property('sentence').eq('I\'m sorry, something went wrong');
            done();
          });
    });

    it('It should return an undefined question when the beacon is incorrect', (done) => {
      chai.request(server)
          .post(`/questions/-1`)
          .set('content-type', 'application/json')
          .send({
            'question': 'What time do you open?',
          })
          .end((err, response) => {
            console.log(response.body);
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('floor').eq(null);
            response.body.should.have.property('sentence').eq('I\'m sorry, something went wrong');
            done();
          });
    });
  });
});
