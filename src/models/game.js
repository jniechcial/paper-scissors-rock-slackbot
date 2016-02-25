const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = Schema({
  playerIds: [String],
  winners: [String],
  channelId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
