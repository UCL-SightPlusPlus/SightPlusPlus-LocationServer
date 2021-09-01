const orgServerUpdater = require('../schedulers/organisationServerUpdater');
const chai = require('chai');
const nock = require('nock');

describe('Organisation Server Scheduler', () => {
  describe('Update the devices', () => {
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

  // describe('Send the devices to the organisation server', () => {
  //   it('Send the devices successfully', (done) => {
  //     const devices = [
  //       {
  //         '_id': '2',
  //         'deviceType': 'BLE',
  //         'deviceLocation': 'Reception',
  //         'site': 'GOSH DRIVE',
  //         'isIndoor': true,
  //         'floor': 0,
  //         'maxOccupancy': 60,
  //         '__v': 0,
  //       },
  //       {
  //         '_id': '4',
  //         'deviceType': 'camera',
  //         'deviceLocation': 'ER',
  //         'site': 'GOSH DRIVE',
  //         'isIndoor': true,
  //         'floor': 0,
  //         'maxOccupancy': 60,
  //         '__v': 0,
  //       }];
  //
  //     const scope = nock(`http://${process.env.ORG_HOST}:${process.env.ORG_PORT}`)
  //         .post('/profiles')
  //         .reply(200, 'success');
  //
  //     orgServerUpdater.sendDevices(devices).then((reply) => {
  //       reply.should.be.eq('success');
  //       done();
  //     });
  //   });
  // });
});
