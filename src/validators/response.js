module.exports = function(message, game, messanger) {
  const possibleResponses = require('../../config/options');
  const response = message.text.split(' ')[1];

  if (possibleResponses.indexOf(response) > -1) {
    return true;
  } else {
    var optionsString = '';
    for (var i = 0; i < possibleResponses.length; i++) {
      if (i !== possibleResponses.length - 1) {
        optionsString += `${possibleResponses[i]} or `;
      } else {
        optionsString += `${possibleResponses[i]}`;
      }
    }

    messanger.respondWith(message, '> I don\'t understand your response to that game! :crying_cat_face:');
    messanger.respondWith(message, `> [_Hint_] Write me: *${game._id}* ${optionsString}`);
    return false;
  }
}
