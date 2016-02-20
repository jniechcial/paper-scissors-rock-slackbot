module.exports = function(message, messanger) {
  const messageArray = message.text.split(' ');
  const challengePresent = messageArray[1] === 'again';
  if (!challengePresent) {
    return false;
  }

  return true;
}
