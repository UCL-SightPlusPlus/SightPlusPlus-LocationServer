'use strict';

exports.createSameFloorSentencesFromRecords = function(beacon, records, recordType) {
  const sentences = [];
  sentences.push(`You are now at the ${beacon.deviceLocation} area. `);
  if (records.length > 0) {
    records.forEach( (record) => sentences.push(this.createSentence(record)));
  } else if (records.length < 1 && recordType == 1) {
    sentences.push('There is no information about a queue in this area.');
  } else if (records.length < 1 && recordType == 2) {
    sentences.push('There is no information about a seating space in this area.');
  }
  return sentences.join('');
};

exports.createDiffFloorSentencesFromRecords = function(beacon, records, locations) {
  const sentences = [];
  const sentence = `You are now on the ${this.ordinalSuffixOf(beacon.floor)} floor. On this floor you can find the ${locations.join(' area , the ')} area. `;
  if (locations.length > 1) {
    sentences.push(sentence.substring(0, sentence.lastIndexOf(',')) + 'and' + sentence.substring(sentence.lastIndexOf(',')+1, sentence.length));
  }
  else {
    sentences.push(sentence);
  }
  if (records.length > 0) {
    records.forEach( (record) => sentences.push(`In the ${record.newLoc} area ${this.createSentence(record)}`));
  }
  return sentences.join('');
};

// eslint-disable-next-line require-jsdoc
exports.createSentence = function createSentenceUsingRecord(record) {
  let sentence = '';
  const targetId = {
    'queueing': 1,
    'freeSeats': 2,
    'event': 3,
  };
  if (record != null) {
    if (record.recordType == targetId.queueing) {
      sentence = `there are ${record.queueing} people in the queue. `;
    } else if (record.recordType == targetId.freeSeats) {
      if (record.freeSeats == 1) {
        sentence = `${record.freeSeats} seat is available. `;
      } else {
        sentence = `${record.freeSeats} seats are available. `;
      }
    } else {
      sentence = `Current event ${record.event}.`;
    };
  };
  return sentence;
};

// eslint-disable-next-line require-jsdoc
exports.ordinalSuffixOf = function ordinalSuffixOf(i) {
  const j = i % 10;
  const k = i % 100;
  if (j == 1 && k != 11) {
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
};
