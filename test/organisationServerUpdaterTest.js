const orgServerUpdater = require('../schedulers/organisationServerUpdater');
const chai = require('chai');
const mongoose = require('mongoose');
const Record = mongoose.model('Records');
const nock = require('nock');

describe('Organisation Server Scheduler', () => {
  describe('Update the devices', () => {
    before(function() {
      const newRunningRecord = new Record({
        'timestamp': new Date(),
        'deviceId': '4',
        'recordType': 2,
        'freeSeats': 3,
      });
      newRunningRecord.save(function(err, record) {
      });
      const newStoppedRecord = new Record({
        'timestamp': '2021-08-31T18:25:43.511Z',
        'deviceId': '4',
        'recordType': 2,
        'freeSeats': 3,
      });
      newStoppedRecord.save(function(err, record) {
      });
    });
    it('Return the updated list of the devices', (done) => {
      const devices = [
        {
          '_id': '2',
          'deviceType': 'BLE',
          'deviceLocation': 'Reception',
          'site': 'GOSH DRIVE',
          'isIndoor': true,
          'floor': 0,
          'maxOccupancy': 60,
          '__v': 0,
        },
        {
          '_id': '4',
          'deviceType': 'camera',
          'deviceLocation': 'ER',
          'site': 'GOSH DRIVE',
          'isIndoor': true,
          'floor': 0,
          'maxOccupancy': 60,
          '__v': 0,
        },
        {
          '_id': '5',
          'deviceType': 'camera',
          'deviceLocation': 'Reception',
          'site': 'GOSH DRIVE',
          'isIndoor': true,
          'floor': 0,
          'maxOccupancy': 60,
          '__v': 0,
        },
        {
          '_id': '6',
          'deviceType': 'camera',
          'deviceLocation': 'Reception',
          'site': 'GOSH DRIVE',
          'isIndoor': true,
          'floor': 0,
          'maxOccupancy': 60,
          '__v': 0,
        }];

      orgServerUpdater.insertCameraState(devices).then((updatedDevices) => {
        updatedDevices.should.be.a('array');
        chai.expect(updatedDevices).to.have.lengthOf(devices.length);
        updatedDevices[1].should.have.property('running');
        updatedDevices[0].should.not.have.property('running');
        done();
      });
    });
  });

  describe('Send the devices to the organisation server', () => {
    const devices = [
      {
        '_id': '2',
        'deviceType': 'BLE',
        'deviceLocation': 'Reception',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 0,
        'maxOccupancy': 60,
        '__v': 0,
      },
      {
        '_id': '4',
        'deviceType': 'camera',
        'deviceLocation': 'ER',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 0,
        'maxOccupancy': 60,
        '__v': 0,
      }];
    it('Send the devices successfully', (done) => {
      nock(`http://${process.env.ORG_HOST}:${process.env.ORG_PORT}`)
          .post('/profile')
          .reply(200, 'success');

      orgServerUpdater.sendDevices(devices).then((reply) => {
        reply.should.be.eq(200);
        nock.cleanAll();
        done();
      });
    });
    it('Fail to send the devices to the server', (done) => {
      orgServerUpdater.sendDevices(devices).then((reply) => {
        reply.should.be.eq(500);
        nock.cleanAll();
        done();
      });
    });
  });
});
