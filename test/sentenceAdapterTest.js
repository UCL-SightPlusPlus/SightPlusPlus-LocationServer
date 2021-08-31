const sentenceAdapter = require('../adapters/sentenceAdapter');
const {expect} = require('chai');

describe('Sentence Adapter', () => {
  describe('Create ordinal suffix', () => {
    it('Converts numbers', () => {
      const first = sentenceAdapter.ordinalSuffixOf(1);
      const second = sentenceAdapter.ordinalSuffixOf(2);
      const third = sentenceAdapter.ordinalSuffixOf(3);
      const fourth = sentenceAdapter.ordinalSuffixOf(4);
      const eleventh = sentenceAdapter.ordinalSuffixOf(11);

      expect(first).to.equal('1st');
      expect(second).to.equal('2nd');
      expect(third).to.equal('3rd');
      expect(fourth).to.equal('4th');
      expect(eleventh).to.equal('11th');
    });
  });
  describe('Create Sentences', () => {
    it('Create queueing sentence', () => {
      const record = {
        '_id': '610a9359a624de104090c26c',
        'timestamp': '2021-08-04T13:17:13.677Z',
        'deviceId': '996',
        'recordType': 1,
        'queueing': 7,
        '__v': 0,
      };
      const sentence = sentenceAdapter.createSentence(record);
      expect(sentence).to.equal('there are 7 people in the queue. ');
      // expect(sentence).to.equal('${record.freeSeats} seat is available. ');
    });
    it('Create 1 available seat sentence', () => {
      const record = {
        '_id': '610a9359a624de104090c26c',
        'timestamp': '2021-08-04T13:17:13.677Z',
        'deviceId': '996',
        'recordType': 2,
        'freeSeats': 1,
        '__v': 0,
      };
      const sentence = sentenceAdapter.createSentence(record);
      expect(sentence).to.equal('1 seat is available. ');
    });

    it('Create multiple available seats sentence', () => {
      const record = {
        '_id': '610a9359a624de104090c26c',
        'timestamp': '2021-08-04T13:17:13.677Z',
        'deviceId': '996',
        'recordType': 2,
        'freeSeats': 3,
        '__v': 0,
      };
      const sentence = sentenceAdapter.createSentence(record);
      expect(sentence).to.equal('3 seats are available. ');
    });
  });
  describe('Create create same floor sentences', () => {
    it('Create a no information about a queue sentence', () => {
      const beacon = {
        '_id': '2',
        'deviceType': 'BLE',
        'deviceLocation': 'Reception',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 0,
        'maxOccupancy': 60,
      };
      const sentence = sentenceAdapter.createSameFloorSentencesFromRecords(beacon, [], 1);
      expect(sentence).to.equal('You are now at the Reception area. There is no information about a queue in this area.');
    });

    it('Create a no information about a seating space sentence', () => {
      const beacon = {
        '_id': '2',
        'deviceType': 'BLE',
        'deviceLocation': 'Reception',
        'site': 'GOSH DRIVE',
        'isIndoor': true,
        'floor': 0,
        'maxOccupancy': 60,
      };
      const sentence = sentenceAdapter.createSameFloorSentencesFromRecords(beacon, [], 2);
      expect(sentence).to.equal('You are now at the Reception area. There is no information about a seating space in this area.');
    });
  });
});
