const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = Schema({
  playerIds: [String],
  channelId: {
    type: String
  }
});

module.exports = mongoose.model('Game', GameSchema);
