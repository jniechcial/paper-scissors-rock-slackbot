// Database setup
require('../../config/mongo-db')();

// Models
const Game = require('../models/game');
const GameResponse = require('../models/game-response');

// Game Rules
const gameRules = require('../slackbot/game-rules');

Game.find({}).lean().exec((err, results) => {
  results.forEach((game) => {
    GameResponse.find({ 'gameId': game._id }).lean().exec((err, results) => {
      if (game.playerIds.length !== results.length) return;

      const gameCounter = gameRules.processToGameCounter(results);
      const drawByAll = gameRules.drawByAllPossibilites(gameCounter);
      const drawByOne = gameRules.drawByOnlyOnePossibility(gameCounter);
      if (!drawByAll && !drawByOne) {
        const winners = gameRules.giveWinners(gameCounter, results).map(winner => winner.userId);
        Game.update({ _id: game._id }, { winners });
      }
    });
  })
});
