const qnaAdapter = require('../adapters/qnaMakerAdapter');

describe('QnA Maker Adapter', () => {
  describe('Generate Answer', () => {
    it('Generates an answer', (done) => {
      const question = 'What time do you open?';

      qnaAdapter.generateAnswer(question).then((sentence) => {
        // console.log(sentence1);
        sentence.should.be.a('object');
        sentence.should.have.property('answers');
        sentence.answers[0].should.have.property('answer').eq('The location is open everyday from 9am to 6pm');
        done();
      });
    });
  });
});
