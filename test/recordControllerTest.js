const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);
const time = new Date().toISOString();
const id = '999';

describe('Record API', () => {
  before(function () {
    const device = {
      '_id': id,
      'deviceType': 'sensor',
      'deviceLocation': 'Main entrance',
      'site': 'GOSH DRIVE',
      'isIndoor': true,
      'floor': 999,
      'maxOccupancy': 50,
    };

    chai.request(server)
      .delete('/devices' + id);

    chai.request(server)
      .post('/devices')
      .set('content-type', 'application/json')
      .send(device)
      .end((err, response) => {
      });
  });
  after(function () {
    chai.request(server)
      .delete('/devices' + id);
  });
  // POST
  describe('Test POST route /records', () => {
    it('It should return a record', (done) => {
      const record = {
        'timestamp': time,
        'deviceId': id,
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
            response.body.should.have.property('deviceId').eq(id);
            response.body.should.have.property('timestamp').eq(record.timestamp.toString());
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
          response.body.length.should.be.eq(1);
          response.body[0].should.have.property('timestamp').eq(time);
          response.body[0].should.have.property('deviceId').eq(id);
          done();
        });
    });
  });

  describe("Test GET /records/:recordType", () => {
    it('It should return latest records of a floor of a specific recordType', (done) => {
      chai.request(server)
        .get('/records/1?floor=999')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.be.eq(1);
          response.body[0].should.have.property('timestamp').eq(time);
          response.body[0].should.have.property('deviceId').eq(id);
          done();
        });
    });
  });
});
