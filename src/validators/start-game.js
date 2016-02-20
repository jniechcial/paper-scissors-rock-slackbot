module.exports = function(message, messanger) {
  const usersHash = require('../data/users-hash').users;

  const messageArray = message.text.split(' ');
  const challengePresent = messageArray[1] === 'challenge';
  if (!challengePresent) {
    messanger.respondWith([{ content: `*Usage*: <@${process.env.SLACK_BOT_NAME}> challenge @user1 @user2 and so on..`, color: 'good' }], message.channel);
    return [];
  }
  if (messageArray.length < 3) {
    messanger.respondWith([{ content: `Hey, you cannot play alone! *Challenge someone!* :gun:`, color: 'warning' }], message.channel);
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

  if (users.indexOf(message.user) < 0) {
    users.push(message.user);
  } else if (users.length === 1) {
    messanger.respondWith([{ content: `Hey, you cannot play alone! *Challenge someone!* :gun:`, color: 'warning' }], message.channel);
    return [];
  }

  if (!usersValid) {
    return [];;
  }

  return users;
}
