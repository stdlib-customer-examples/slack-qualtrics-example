const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const Qualtrics = require('qualtrics-sdk-node');

// Uncomment to add Qualtrics API
// const qualtrics = new Qualtrics({
//   dataCenter: '...',
//   apiToken: '...',
// });

/**
* An HTTP endpoint that acts as a webhook for Slack command event
* @param {object} event Slack command event body (raw)
* @returns {object} result The result of your workflow steps
*/
module.exports = async (event) => {

  // Prepare workflow object to store API responses

  let result = {};

  // [Workflow Step 1]

  console.log(`Running slack.conversations[@0.2.5].info()...`);

  result.step1 = {};
  result.step1.channel = await lib.slack.conversations['@0.2.5'].info({
    id: `${event.channel_id}`
  });

  // [Workflow Step 2]

  console.log(`Running slack.users[@0.3.21].retrieve()...`);

  result.step2 = {};
  result.step2.user = await lib.slack.users['@0.3.21'].retrieve({
    user: `${event.user_id}`
  });

  // [Workflow Step 3]

  console.log(`Running slack.channels[@0.6.3].messages.create()...`);

  result.step3 = {};
  result.step3.response = await lib.slack.channels['@0.6.3'].messages.create({
    channel: `#${result.step1.channel.name}`,
    text: `Hey ${result.step2.user.name}! You requested a survey.`,
    attachments: null,
    blocks: null
  });

  // TALK TO QUALTRICS WITH NPM PACKAGE
  let mockFile = Buffer.from('Header1,Header2,Header3\nValue1,Value2,Value3');

  // [Workflow Step 4]

  console.log(`Running slack.channels[@0.6.3].files.create()...`);

  result.step4 = {};
  result.step4.returnValue = await lib.slack.channels['@0.6.3'].files.create({
    filename: `survey-${new Date().toISOString()}.csv`, // required
    channels: [result.step1.channel.id], // required
    content: mockFile, // required
    title: null,
    text: null
  });

  return result;
};
