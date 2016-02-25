const http = require('http');
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

// Slack bot engine
const slackBot = require('./src/slackbot/engine')(rtm, web);

// Start Slack RTM
rtm.start();

// Setup users hash
require('./src/initializers/users-hash-initializer')(web);

// basic slackBot loop
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, () => {
  rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    if (!message.text) return;

    if(message.channel.match(/^D/)) {
      slackBot.privateMessageToSlackbot(message);
    } else if (slackBot.channelMessageToSlackbot(message)) {
      slackBot.acceptCommand(message);
    }
  });
});

// basic http server
http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write('Good morning!');
  response.end();
}).listen(process.env.PORT);
