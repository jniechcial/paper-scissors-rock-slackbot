// Models
const Game = require('../models/game');

const possibleResponses = require('../../config/options');

module.exports = {
  drawByAllPossibilites(gameCounter) {
    return gameCounter.every((item) => {
      return item > 0;
    });
  },

  drawByOnlyOnePossibility(gameCounter) {
    var optionsCount = 0;
    gameCounter.forEach((item) => {
      if (item) optionsCount++
    });
    return optionsCount === 1;
  },

  giveWinners(gameCounter, users) {
    var winningOption = null;
    if (gameCounter[0] && gameCounter[1]) {
      winningOption = 'scissors';
    } else if (gameCounter[1] && gameCounter[2]) {
      winningOption = 'paper';
    } else {
      winningOption = 'rock';
    }
    const winners = users.filter((item) => {
      return item.response === winningOption;
    });

    return winners;
  },

  processToGameCounter(results) {
    const gameCounter = [];

    possibleResponses.forEach((item) => {
      gameCounter.push(0);
    });

    results.forEach((result) => {
      gameCounter[possibleResponses.indexOf(result.response)]++;
    });

    return gameCounter;
  },

  updateWinners(game, winners) {
    Game.update({ _id: game._id }, { winners: winners.map(winner => winner.userId) }, (err) => {
      if (err) console.log(err);
    });
  },
};
