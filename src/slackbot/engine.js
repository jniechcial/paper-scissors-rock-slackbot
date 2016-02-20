const Promise = require('promise');

// Constants
const possibleResponses = require('../../config/options');

// Models
const Game = require('../models/game');
const GameResponse = require('../models/game-response');

module.exports = function(slackClient, slackWebClient) {
  const dataHelpers = require('../data/helpers')(slackWebClient);
  const messanger = require('./messanger')(slackClient);
  const startGameValidator = require('../validators/start-game');
  const restartGameValidator = require('../validators/restart-game');
  const responseValidator = require('../validators/response');
  const gameRules = require('./game-rules');

  return {
    channelMessageToSlackbot(message) {
      const firstWord = message.text.split(' ')[0];
      return (firstWord === process.env.SLACK_BOT_NAME) ||
        (firstWord === `<@${process.env.SLACK_BOT_SLACK_ID}>:`) ||
        (firstWord === `<@${process.env.SLACK_BOT_SLACK_ID}>`);
    },

    privateMessageToSlackbot(message) {
      dataHelpers.fetchUserDirectMessageId(message).then((directMessageId) => {
        if (message.channel === directMessageId) this._acceptResponse(message);
      });
    },

    startGame(message) {
      if (restartGameValidator(message, messanger)) {
        return this._restartGame(message);
      }

      const users = startGameValidator(message, messanger);
      if (!users.length) return;

      const game = new Game({ playerIds: users, channelId: message.channel });
      game.save(() => {
        messanger.notifyAboutStartGame(message, game);
      });
    },

    _acceptResponse(message) {
      this._extractPossibleGameObject(message).then((game) => {
        if (responseValidator(message, game, messanger)) return this._createResponse(message, game);
      }).then((game) => {
        this._checkGameStatus(game);
      }).catch((err) => {
        if (err !== 'Flow escape') console.log(err);
      });
    },

    _extractPossibleGameObject(message) {
      var gameId = message.text.split(' ')[0];
      if (gameId.match(/\*[a-zA-Z0-9]*\*/)) {
        gameId = gameId.slice(1, gameId.length - 1);
      }

      return new Promise((resolve, reject) => {
        Game.findOne({ '_id': gameId }, (error, game) => {
          if (game) {
            resolve(game);
          } else {
            Game.find({ playerIds: message.user })
              .sort({ createdAt: -1 })
              .limit(1).lean().exec((err, results) => {
                messanger.respondWith(message, '> No such game in database :crying_cat_face:');
                if (results.length) {
                  messanger.respondWith(message, `> Maybe a typo? Your last game was *${results[0]._id}*`);
                }
              });
            reject('Flow escape');
          }
        });
      });
    },

    _createResponse(message, game) {
      return new Promise((resolve, reject) => {
        GameResponse.findOne({ 'gameId': game._id, 'userId': message.user }, (error, gameResponse) => {
          if (gameResponse) {
            messanger.respondWith(message, '> You already responded to this game! :troll:');
            reject('Flow escape');
          } else {
            resolve();
          }
        });
      }).then(() => {
        return new Promise((resolve, reject) => {
          const gameResponseObject = new GameResponse({
            gameId: game._id,
            userId: message.user,
            response: message.text.split(' ')[1],
          });
          gameResponseObject.save(() => {
            messanger.respondWith(message, '> *Acknowledgement!* Wish you luck! :ok_hand:');
            messanger.notifyAboutResponse(game, gameResponseObject);
            resolve(game);
          });
        });
      });
    },

    _checkGameStatus(game) {
      GameResponse.find({ 'gameId': game._id }).lean().exec((err, results) => {
        if (game.playerIds.length !== results.length) return;

        const gameCounter = gameRules.processToGameCounter(results);
        if (gameRules.drawByAllPossibilites(gameCounter)) {
          messanger.notifyAboutDraw(game);
        } else if (gameRules.drawByOnlyOnePossibility(gameCounter)) {
          messanger.notifyAboutDraw(game);
        } else {
          messanger.notifyAboutWinners(game, gameRules.giveWinners(gameCounter, results));
        }
        messanger.notifyAboutResponses(game, results);
      });
    },

    _restartGame(message) {
      Game.find({ playerIds: message.user })
        .sort({ createdAt: -1 })
        .limit(1).lean().exec((err, results) => {
          if (results.length) {
            const game = new Game({
              playerIds: results[0].playerIds,
              channelId: results[0].channelId
            });

            game.save(() => {
              messanger.notifyAboutStartGame(message, game);
            });
          } else {
            messanger.respondWith(message, `> Holy moly, you have not played yet! :rocket:`);
          }
        });
    },
  };
};
