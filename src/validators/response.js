module.exports = function(message) {
  const possibleResponses = require('../../config/options');
  const response = message.text.split(' ')[1];
  if (possibleResponses.indexOf(response) > -1) {
    return true;
  } else {
    messanger.respondWith(message, 'Don\'t understand your response to that game!');
    return false;
  }
}
