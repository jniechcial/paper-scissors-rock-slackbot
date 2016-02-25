const Promise = require('promise');

// Models
const Game = require('../models/game');

const diff = (firstArray, secondArray) => {
    return firstArray.filter((i) => { return secondArray.indexOf(i) < 0; });
};

module.exports = function() {
  return new Promise((resolve, reject) => {
    const userStats = [];
    Game.find({}).lean().exec((err, results) => {
      if (err) reject(err);
      results.forEach((game) => {
        const users = game.playerIds || [];
        const winners = game.winners || [];
        users.forEach((user) => {
          if (userStats[user] !== null && typeof userStats[user] === 'object') {
            userStats[user]['played']++;
          } else {
            userStats[user] = { played: 1, won: 0 };
          }
        });
        winners.forEach((winner) => {
          if (userStats[winner]) userStats[winner]['won']++;
        });
      });
      const userStatsArray = Object.keys(userStats).map((key) => {
        const stat = userStats[key];
        stat['rank'] = parseFloat(stat.won) / parseFloat(stat.played);
        stat['userId'] = key;
        return stat;
      });
      const sorted = userStatsArray.sort((a, b) => {
        return b.won - a.won;
      });
      resolve(sorted.slice(0, 3));
    });
  });
};
