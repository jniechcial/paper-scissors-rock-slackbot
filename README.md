# Paper Scissors Rock Slackbot
This simple Slack bot allows Slack users to play paper-scissors-rock game between them. Ever had a situation where no compromis is available? Who is calling for pizza? Who is setting up PlayStation? Who is writing explenation email to the customer? No problem - play paper-scissors-rock and settle the fight once for all!

# Usage
Usage is simple and self-describing while talking with the bot - he will help you go through the game. To initiate the new game (assuming your botname is *judge*):

![Init the game](https://s3.eu-central-1.amazonaws.com/github-readmes/init.png)

Then response on DM directly to bot:

![Give your response](https://s3.eu-central-1.amazonaws.com/github-readmes/response.png)

Bot will notify other players that you responded on origin channel:

![Monitor status](https://s3.eu-central-1.amazonaws.com/github-readmes/status.png)

After everyone responds, bot will give you the results!

![Finished game](https://s3.eu-central-1.amazonaws.com/github-readmes/finish.png)

# Features
* If you make a typo in game reference, he will give you your last game ID
![Typo in game reference](https://s3.eu-central-1.amazonaws.com/github-readmes/helper.png)

* You can respond only once!
![Only single response](https://s3.eu-central-1.amazonaws.com/github-readmes/single-response.png)

* After finished game, draw or not, you can simply say *again* to challange same competitors!
![Say Again](https://s3.eu-central-1.amazonaws.com/github-readmes/say-again.png)

* Type `@botname stats` to see three players with the biggest won count.
![Say stats](https://s3.eu-central-1.amazonaws.com/github-readmes/say-stats.png)

# Deployment
1. Fork the repository.
2. Run `cp .env.sample.ini .env.ini`.
3. Fill in env variables with your data (slack token, slack bot name, mongo URI).
4. Deploy to Heroku.

# License
This bot is under [MIT License](https://github.com/jniechcial/paper-scissors-rock-slackbot/blob/master/LICENSE).
