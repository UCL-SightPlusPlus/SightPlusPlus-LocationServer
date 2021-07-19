const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { response } = require('express');
const { expect } = require('chai');

chai.should();
chai.use(chaiHttp);

describe('Record API', () => {
  // POST
  describe('Test POST route /records', () => {
    it('It should return a record', (done) => {
      const record = {
        'timestamp': '2012-04-23T18:25:43.511Z',
        'deviceId': 1,
        'targetId': 1,
        'queueing': 7,
      };
      chai.request(server)
          .post('/records')
          .set('content-type', 'application/json')
          .send(record)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('deviceId').eq(record.deviceId.toString());
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
  });
});
