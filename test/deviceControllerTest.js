const server = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);
const id = '998';

describe('Device APIs', () => {
  // POST
  describe('Test POST route /devices', () => {
    it('It should return the device', (done) => {
      const device = {
        '_id': id,
        'deviceType': 'BLE',
        'deviceLocation': 'Main entrance',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 1,
        'maxOccupancy': 50,
      };

      chai.request(server)
          .post('/devices')
          .set('content-type', 'application/json')
          .send(device)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('_id').eq(id);
            done();
          });
    });


    it('It should return a 400 error', (done) => {
      const device = {
        '_id': id,
        'deviceType': 'BLE',
        'deviceLocation': 'Main entrance',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 1,
        'maxOccupancy': 50,
      };

      chai.request(server)
          .post('/devices')
          .set('content-type', 'application/json')
          .send(device)
          .end((err, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            done();
          });
    });
  });

  // GET
  describe('Test GET route /devices', () => {
    it('It should return all devices', (done) => {
      chai.request(server)
          .get('/devices')
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.not.be.eq(0);
            done();
          });
    });
  });

  // GET by id
  describe('Test GET by id route /devices/:id', () => {
    it('It should return a device', (done) => {
      chai.request(server)
          .get('/devices/' + id)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('_id').eq(id);
            done();
          });
    });

    it('It should return that a device does not exist', (done) => {
      chai.request(server)
          .get('/devices/' + 997)
          .end((err, response) => {
            response.should.have.status(404);
            response.body.should.be.a('object');
            response.body.should.have.property('message').eq('Device ' + 997 + ' does not exist.');
            done();
          });
    });
  });

  // PUT
  describe('Test PUT route /devices/:id', () => {
    it('It should update a device', (done) => {
      const device = {
        'deviceType': 'camera',
      };
      chai.request(server)
          .put('/devices/' + id)
          .send(device)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('deviceType').eq('camera');
            done();
          });
    });

    it('It should not update a device\'s id', (done) => {
      const device = {
        '_id': '1234',
      };
      chai.request(server)
          .put('/devices/' + id)
          .send(device)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('_id').eq(id);
            done();
          });
    });

    it('It should not update a device', (done) => {
      const device = {
        '_id': '1234',
        'deviceType': 'camera',
      };
      chai.request(server)
          .put('/devices/' + device._id)
          .send(device)
          .end((err, response) => {
            response.should.have.status(404);
            response.body.should.be.a('object');
            response.body.should.have.property('message').eq('Device Id not found');
            done();
          });
    });
  });

  // DELETE
  describe('Test DELETE route /devices/:id', () => {
    it('It should delete the device', (done) => {
      chai.request(server)
          .delete('/devices/' + id)
          .end((err, response) => {
            response.should.have.status(200);
            response.body.should.have.property('message').eq('Device successfully deleted');
            done();
          });
    });

    it('It should return that the device does not exist', (done) => {
      chai.request(server)
          .delete('/devices/' + id)
          .end((err, response) => {
            response.should.have.status(404);
            response.body.should.have.property('message').eq('Device ' + id + ' does not exist.');
            done();
          });
    });
  });
});
