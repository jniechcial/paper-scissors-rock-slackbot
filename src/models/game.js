const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = Schema({
  playerIds: [String],
  channelId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
