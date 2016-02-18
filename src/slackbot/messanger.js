module.exports = function(_slackClient) {
  const slackClient = _slackClient;

  return {
    notifyAboutWinners(game, winners) {
      var winnersString = '';
      winners.forEach((winner) => {
        winnersString += `<@${winner.userId}>`;
      })
      slackClient.sendMessage(`Game ${game._id} finished with winners: ${winnersString}`, game.channelId);
    },

    notifyAboutDraw(game) {
      slackClient.sendMessage(`Game ${game._id} finished with draw!`, game.channelId);
    },

    respondWith(message, content) {
      slackClient.sendMessage(content, message.channel);
    },
  };
};
