const RtmClient = require('slack-client').RtmClient;
const WebClient = require('slack-client').WebClient;
const RTM_EVENTS = require('slack-client').RTM_EVENTS;
const RTM_CLIENT_EVENTS = require('slack-client').CLIENT_EVENTS.RTM;

// Slack RTM setup
const token = process.env.SLACK_API_TOKEN || '';
const rtm = new RtmClient(token);
const web = new WebClient(token);

// Database setup
require('./config/mongo-db')();
// Start Slack RTM
rtm.start();
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, () => {
  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
  });
});
