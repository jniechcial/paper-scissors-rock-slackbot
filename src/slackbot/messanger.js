const possibleResponses = require('../../config/options');

module.exports = function(_slackClient, _webClient) {
  const slackClient = _slackClient;
  const webClient = _webClient;

  const client = {
    sendPlainMessage(content, channel) {
      slackClient.sendMessage(content, channel);
    },
    sendColoredMessage(contentArray, channel) {
      const attachments = contentArray.map((item) => {
        return {
          fallback: item.content,
          color: item.color,
          text: item.content,
          mrkdwn_in: ['text'],
        };
      });
      webClient.chat.postMessage(channel, '', {
        as_user: true,
        attachments: JSON.stringify(attachments)
      });
    },
  }

  return {
    notifyAboutWinners(game, winners) {
      var winnersString = '';
      winners.forEach((winner) => {
        winnersString += `<@${winner.userId}>`;
      })
      client.sendColoredMessage([{ content: `Game *${game._id}* finished with winners: ${winnersString} :dancers: :confetti_ball:`, color: 'good' }], game.channelId);
    },

    notifyAboutDraw(game) {
      client.sendColoredMessage([{ content: `Game *${game._id}* finished with *draw* :peace_symbol:`, color: 'good' }], game.channelId);
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

      client.sendColoredMessage([
        { content: `Starting game *${game._id}* between ${playersString}. *Fight!* :white_square: :scissors: :melon:`, color: 'good' },
        { content: `[_Hint_] Respond DM to me with: *${game._id}* ${optionsString}`, color: 'good' }
      ], message.channel);
    },

    notifyAboutResponses(game, responses) {
      var message = '';
      responses.forEach((response) => {
        message += `<@${response.userId}> responded with *${response.response}*\n`;
      });
      const content = [
        { content: message, color: 'good' },
        { content: `Wanna fight again in the same team? :chicken: Type: <@${process.env.SLACK_BOT_NAME}> again`, color: 'good' },
      ];
      client.sendColoredMessage(content, game.channelId);
    },

    notifyAboutResponse(game, response) {
      client.sendColoredMessage([{ content: `Game *${game._id}* status: <@${response.userId}> responded! :boom: :boom: :boom:`, color: 'good' }], game.channelId);
    },

    respondWith(content, channel) {
      client.sendColoredMessage(content, channel);
    },
  };
};
