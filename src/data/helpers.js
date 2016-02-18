const Promise = require('promise');

module.exports = function(_webClient) {
  const webClient = _webClient;
  const usersDMHash = require('../data/users-dm-hash').userDMs;

  return {
    fetchUserDirectMessageId(message) {
      return new Promise((resolve, reject) => {
        var directMessageChannelId = usersDMHash.get(message.user);
        if (directMessageChannelId) {
          resolve(directMessageChannelId);
        } else {
          webClient.dm.open(message.user, function(err, res) {
            usersDMHash.set(message.user, res.channel.id);
            resolve(res.channel.id);
          });
        }
      });
    },
  }
};
