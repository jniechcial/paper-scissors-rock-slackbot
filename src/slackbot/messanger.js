const possibleResponses = require('../../config/options');

module.exports = function(_slackClient) {
  const slackClient = _slackClient;

  return {
    notifyAboutWinners(game, winners) {
      var winnersString = '';
      winners.forEach((winner) => {
        winnersString += `<@${winner.userId}>`;
      })
      slackClient.sendMessage(`> Game *${game._id}* finished with winners: ${winnersString} :dancers: :confetti_ball:`, game.channelId);
    },

    notifyAboutDraw(game) {
      slackClient.sendMessage(`> Game *${game._id}* finished with *draw* :peace_symbol:`, game.channelId);
    },

    notifyAboutStartGame(message, game) {
      var playersString = '';
      for (var i = 0; i < game.playerIds.length; i++) {
        if (i === game.playerIds.length - 2) {
          playersString += `<@${game.playerIds[i]}> and `;
        } else if (i === game.playerIds.length - 1) {
          playersString += `<@${game.playerIds[i]}>`;
        } else {
          playersString += `<@${game.playerIds[i]}> `;
        }
      }
      var optionsString = '';
      for (var i = 0; i < possibleResponses.length; i++) {
        if (i !== possibleResponses.length - 1) {
          optionsString += `${possibleResponses[i]} or `;
        } else {
          optionsString += `${possibleResponses[i]}`;
        }
      }

      slackClient.sendMessage(`> Starting game *${game._id}* between ${playersString}. *Fight!* :white_square: :scissors: :melon:`, message.channel);
      slackClient.sendMessage(`> [_Hint_] Respond DM to me with: *${game._id}* ${optionsString}`, message.channel);
    },

    notifyAboutResponses(game, responses) {
      var message = '';
      responses.forEach((response) => {
        message += `> <@${response.userId}> responded with *${response.response}*\n`;
      });
      message += `> Wanna fight again? :chicken: Type: <@${process.env.SLACK_BOT_NAME}> again`;
      slackClient.sendMessage(message, game.channelId);
    },

    notifyAboutResponse(game, response) {
      slackClient.sendMessage(`> Game *${game._id}* status: <@${response.userId}> responded! :boom: :boom: :boom:`, game.channelId);
    },

    respondWith(message, content) {
      slackClient.sendMessage(content, message.channel);
    },
  };
};
