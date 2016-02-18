const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameResponse = Schema({
  gameId: {
    type: String
  },
  userId: {
    type: String
  },
  response: {
    type: String
  },
});

module.exports = mongoose.model('GameResponse', GameResponse);
