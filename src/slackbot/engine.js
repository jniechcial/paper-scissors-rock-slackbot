const Promise = require('promise');

// Constants
const possibleResponses = require('../../config/options');
module.exports = function(slackClient, slackWebClient) {
  return {
    channelMessageToSlackbot(message) {
      const firstWord = message.text.split(' ')[0];
      return (firstWord === process.env.SLACK_BOT_NAME) ||
        (firstWord === `<@${process.env.SLACK_BOT_SLACK_ID}>:`) ||
        (firstWord === `<@${process.env.SLACK_BOT_SLACK_ID}>`);
    },

    privateMessageToSlackbot(message) {
    },

    startGame(message) {
    },
};
