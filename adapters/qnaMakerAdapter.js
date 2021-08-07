'use strict';

// <Dependencies>
const cron = require('node-cron');
require('dotenv').config();
const msRest = require('@azure/ms-rest-js');
const qnamakerRuntime = require('@azure/cognitiveservices-qnamaker-runtime');
// </Dependencies>

let runtimeClient = null;

// <GenerateAnswer>
exports.generateAnswer = async (question) => {
  console.log(`Querying knowledge base...`);
  let requestQuery = null;

  requestQuery = await runtimeClient.runtime.generateAnswer(
      process.env.KB_ID,
      {
        question: question,
        top: 1,
      },
  ).catch((error) => {
    return null;
  });
  return requestQuery;
};
// </GenerateAnswer>

exports.run = async (deviceCron) => {
  // <AuthorizationQuery>
  console.log('Starting QnA Maker runtime ' + process.env.KB_ENDPOINT_KEY);
  const queryRuntimeCredentials = new msRest.ApiKeyCredentials({inHeader: {'Authorization': 'EndpointKey ' + process.env.KB_ENDPOINT_KEY}});
  runtimeClient = new qnamakerRuntime.QnAMakerRuntimeClient(queryRuntimeCredentials, process.env.KB_HOST);

  cron.schedule( deviceCron, () => {
    if (runtimeClient == null) {
      runtimeClient = new qnamakerRuntime.QnAMakerRuntimeClient(queryRuntimeCredentials, process.env.KB_HOST);
    }
  });
  // </AuthorizationQuery>
};
