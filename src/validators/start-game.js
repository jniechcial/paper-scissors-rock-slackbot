module.exports = function(message, messanger) {
  const usersHash = require('../data/users-hash').users;

  const messageArray = message.text.split(' ');
  const challengePresent = messageArray[1] === 'challenge';
  if (!challengePresent) {
    messanger.respondWith(message, `Usage: ${process.env.SLACK_BOT_NAME} challenge user1 user2 ...!`)
    return [];
  }
  if (messageArray.length < 3) {
    messanger.respondWith(message, `Hey, you cannot play alone!`)
    return [];
  }

  var usersValid = true;
  const users = messageArray.splice(2, messageArray.length).map((user) => {
    const tempUser = usersHash.get(user);
    if (!tempUser) {
      messanger.respondWith(message, `Sorry, I don't recognize ${user} :(`)
      usersValid = false;
    }
    return tempUser;
  });
  users.push(message.user);

  if (!usersValid) {
    return [];;
  }

  return users;
}
