const _ = require('underscore');

module.exports = function(message, messanger, currentId) {
  const usersHash = require('../data/users-hash').users;

  const messageArray = message.text.split(' ');
  const challengePresent = messageArray[1] === 'challenge';
  if (!challengePresent) {
    messanger.respondWith([{ content: `*Usage*: <@${process.env.SLACK_BOT_NAME}> challenge @user1 @user2 and so on..`, color: 'good' }], message.channel);
    return [];
  }

  var usersValid = true;
  const users = messageArray.splice(2, messageArray.length).map((user) => {
    if (user.match(/<@[a-zA-Z0-9]*>/)) {
      return user.slice(2, user.length - 1);
    }

    const tempUser = usersHash.get(user);
    if (!tempUser) {
      messanger.respondWith([{ content: `Sorry, I don't recognize *${user}* - typo? :crying_cat_face:`, color: 'danger' }], message.channel);
      usersValid = false;
    }
    return tempUser;
  });

  const filteredUsers = _.uniq(users.filter((user) => {
    return user !== currentId;
  }));

  if (filteredUsers.indexOf(message.user) < 0) {
    filteredUsers.push(message.user);
  } else if (filteredUsers.length === 1) {
    messanger.respondWith([{ content: `Hey, you cannot play alone! *Challenge someone!* :gun:`, color: 'warning' }], message.channel);
    return [];
  }

  if (!usersValid) {
    return [];
  }

  return filteredUsers;
}
