# Telegram Bot API setup
Instructions for getting a Bot API token for Telegram.

## Setup

1. Contact [@BotFather](https://telegram.me/botfather) on Telegram.
2. Use the `/newbot` command and follow the instructions.
3. Make note of the HTTP API token.
4. By default, Telegram bots only receive messages that are explicitly
   addressed to them (direct replies, or commands starting with a `/` slash).
   For the bridge you probably want to disable this security feature by using
   the `/setprivacy` BotFather command. Make sure you set the setting to
   `DISABLED`.
5. Optionally set a profile picture for the bot, using `/setuserpic`.
6. Add the bot into one of your Telegram groups. Most Telegram clients can do
   this by viewing the Bot's profile page, then choosing `Add to group`.
