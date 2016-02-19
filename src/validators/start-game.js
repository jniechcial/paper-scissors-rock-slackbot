module.exports = function(message, messanger) {
  const usersHash = require('../data/users-hash').users;

  const messageArray = message.text.split(' ');
  const challengePresent = messageArray[1] === 'challenge';
  if (!challengePresent) {
    messanger.respondWith(message, `> *Usage*: <@${process.env.SLACK_BOT_NAME}> challenge @user1 @user2 and so on..`);
    return [];
  }
  if (messageArray.length < 3) {
    messanger.respondWith(message, `> Hey, you cannot play alone! *Challenge someone!* :gun:`);
    return [];
  }

  var usersValid = true;
  const users = messageArray.splice(2, messageArray.length).map((user) => {
    if (user.match(/<@[a-zA-Z0-9]*>/)) {
      return user.slice(2, user.length - 1);
    }

    const tempUser = usersHash.get(user);
    if (!tempUser) {
      messanger.respondWith(message, `> Sorry, I don't recognize *${user}* - typo? :crying_cat_face:`);
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
