# Paper Scissors Rock Slackbot
This simple Slack bot allows Slack users to play paper scissors rock game between them.

# Usage
Assuming your nick name is `user0` say on Slack channel:
```
@your-slack-bot-name challenge user1 user2 ...
```
Bot responds:
```
Starting game #123
```
Go to DM with slack bot and type:
```
#123 scissors (or rock or paper)
```
After all players responds, the result is posted on base channel:
```
Game #123 finished with winners: @user1
```
If the draw happens, the game is ongoing and the bot asks for figures again:
```
Game #123 finished with draw!
```

# WIP
Take notice that this is work in progress, will get better UX!

# License
This bot is under MIT License.
