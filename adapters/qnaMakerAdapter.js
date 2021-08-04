"use strict";

// <Dependencies>
require('dotenv').config();
const msRest = require("@azure/ms-rest-js");
const qnamaker = require("@azure/cognitiveservices-qnamaker");
const qnamaker_runtime = require("@azure/cognitiveservices-qnamaker-runtime");
// </Dependencies>

let runtimeClient;

// <GenerateAnswer>
exports.generateAnswer = async (question) => {
  console.log(`Querying knowledge base...`)

  const requestQuery = await runtimeClient.runtime.generateAnswer(
    process.env.KB_ID,
    {
      question: question,
      top: 1
    }
  );
  console.log(JSON.stringify(requestQuery));
  return requestQuery;
}
// </GenerateAnswer>

exports.run = async () => {
  // <AuthorizationQuery>
  console.log('Starting QnA Maker runtime');
  const queryRuntimeCredentials = new msRest.ApiKeyCredentials({ inHeader: { 'Authorization': 'EndpointKey ' + process.env.KB_ENDPOINT_KEY } });
  runtimeClient = new qnamaker_runtime.QnAMakerRuntimeClient(queryRuntimeCredentials, process.env.KB_HOST);
  // </AuthorizationQuery>
}