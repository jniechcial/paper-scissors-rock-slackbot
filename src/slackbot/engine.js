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
      const users = startGameValidator(message, messanger);
      if (!users.length) return;

      const game = new Game({ playerIds: users, channelId: message.channel });
      game.save(() => {
        messanger.respondWith(message, `Starting game ${game._id}...`);
      });
    },

    _acceptResponse(message) {
      this._extractPossibleGameObject(message).then((game) => {
        if (responseValidator(message)) return this._createResponse(message, game);
      }).then((game) => {
        this._checkGameStatus(game);
      }).catch((err) => {
        if (err !== 'Flow escape') console.log('error');
      });
    },

    _extractPossibleGameObject(message) {
      const gameId = message.text.split(' ')[0];

      return new Promise((resolve, reject) => {
        Game.findOne({ '_id': gameId }, (error, game) => {
          if (game) {
            resolve(game);
          } else {
            messanger.respondWith(message, 'No such game in database :(');
            reject();
          }
        });
      });
    },

    _createResponse(message, game) {
      return new Promise((resolve, reject) => {
        GameResponse.findOne({ 'gameId': game._id, 'userId': message.user }, (error, gameResponse) => {
          if (gameResponse) {
            messanger.respondWith(message, 'You already responded to this game!');
            reject();
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
            messanger.respondWith(message, 'Acknowledgement!');
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
      });
    },
  };
};
