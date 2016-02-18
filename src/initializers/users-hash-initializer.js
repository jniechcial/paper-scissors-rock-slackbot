module.exports = function(webClient) {
  const usersHash = require('../data/users-hash').users;

  webClient.users.list(function(err, res) {
    res.members.forEach((user) => {
      usersHash.set(user.name, user.id);
    });
  });
};
