const qnaAdapter = require('../adapters/qnaMakerAdapter');
const chai = require('chai');
const nock = require('nock');

describe('QnA Maker Adapter', () => {
  let env;
  describe('Generate Answer', () => {
    // saving an environment
    before(function() {
      env = process.env.KB_ID;
    });

    it('Should Generate an answer', (done) => {
      const question = 'What time do you open?';
      nock(`${process.env.KB_HOST}`)
          .post(`/qnamaker/knowledgebases/${process.env.KB_ID}/generateAnswer`)
          .reply(200, {
            'answers': [
              {
                'questions': [
                  'What time do you open?',
                  'What time do you close?',
                  'What\'s the opening hours?',
                ],
                'answer': 'The location is open everyday from 9am to 6pm',
                'score': 95.0,
                'id': 1,
                'source': 'QnA Maker Sample FAQ.xlsx',
                'isDocumentText': false,
                'metadata': [],
                'context': {
                  'isContextOnly': false,
                  'prompts': [],
                },
              },
            ],
            'activeLearningEnabled': false,
          });

      qnaAdapter.generateAnswer(question).then((sentence) => {
        sentence.should.be.a('object');
        sentence.should.have.property('answers');
        sentence.answers[0].should.have.property('answer').eq('The location is open everyday from 9am to 6pm');
        nock.cleanAll();
        done();
      });
    }).timeout(4000);

    it('Should return null', (done) => {
      process.env.KB_ID = '123';
      const question = 'What time do you open?';

      qnaAdapter.generateAnswer(question).then((sentence) => {
        chai.expect(sentence).to.be.null;
        done();
      });
    }).timeout(4000);

    // restoring everything back
    after(function() {
      process.env.KB_ID = env;
    });
  });
});
