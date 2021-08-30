'use strict';

/**
 * Creates the sentences that will be returned to the user.
 * @param {Object} beacon - The beacon that the user is closer to [follows deviceModel].
 * @param {Object} records - The latest records from all the cameras that are in the same floor as the beacon and in the same room/area as the beacon.
 * @param {int} recordType - The type of record to be searched for the user. 1 for queueing, 2 for empty chairs.
 * @return {string} The sentences that will be returned to the user.
 */
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


/**
 * Creates the sentences that will be returned to the user.
 * @param {Object} beacon - The beacon that the user is closer to [follows deviceModel].
 * @param {Object} records - The latest records from all the cameras that are in the same floor as the beacon.
 * @param {Array} locations - All the rooms/areas that are in the same floor as the beacon.
 * @return {string} The sentences that will be returned to the user.
 */
exports.createDiffFloorSentencesFromRecords = function(beacon, records, locations) {
  const sentences = [];
  const sentence = `You are now on the ${this.ordinalSuffixOf(beacon.floor)} floor. On this floor you can find the ${locations.join(' area , the ')} area. `;
  if (locations.length > 1) {
    sentences.push(sentence.substring(0, sentence.lastIndexOf(',')) + 'and' + sentence.substring(sentence.lastIndexOf(',')+1, sentence.length));
  } else {
    sentences.push(sentence);
  }
  if (records.length > 0) {
    records.forEach( (record) => sentences.push(`In the ${record.newLoc} area ${this.createSentence(record)}`));
  }
  return sentences.join('');
};

/**
 * Creates a sentence when the question cannot be understood or answered.
 * @return {string} The sentence that will be returned to the user.
 */
exports.undefinedSentence = function() {
  return 'I\'m sorry, I do not know the answer to that question.';
};


/**
 * Creates the sentences that will be returned to the user when asked where he is.
 * @param {Object} beacon - The beacon that the user is closer to [follows deviceModel].
 * @return {string} The sentence that will be returned to the user.
 */
exports.locationSentence = function locationSentence(beacon) {
  return `You are now at the ${beacon.deviceLocation} area on the ${this.ordinalSuffixOf(beacon.floor)} floor`;
};


/**
 * Creates a sentence from a specified record.
 * @param {Object} record - The latest record from a camera.
 * @return {string} The sentence that will be returned to the user.
 */
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


/**
 * Takes a integer and adds it's letter suffixes.
 * @param {int} i - The integer.
 * @return {string} The integer with it's letter suffixes.
 */
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
