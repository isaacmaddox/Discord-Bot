# Moderation Bot

## My first Discord bot

This is a very simple discord bot written using node, discord.js, and other discord.js dependencies. The intended purpose of the bot is to be able to moderate a specific server.

If you look through the code, you will see that some roles and channels are mentioned by specific names, or even their specific ID. This is because the bot is only intended to work in one server at the moment. In the future, I plan to make it expandable and maybe even customizable through setup commands.

## Intended Functions

To use a command using the bot, the user simply writes a message beginning with ",". The bot will read this message and execute the requested command. For example, if I were to type ",help", the bot would reply with a help menu.

### Ban / Unban

Using ",ban { user mention | user ID } ?{ reason }", a member of the server with the "Moderation" role (again, specific to my server) can invoke a ban on a user, and optionally give a reason for the ban. In a future release, the bot will send a message to a logs channel with the information of the ban.

Using ",unban { user ID }", a member of the server with the "Moderation" role can revoke a ban on a user given their user ID. This ID can be obtained either by enabling "Developer Mode" within Discord and right-clicking on the user, or by running the ",info" command.

### Kick

Using ",kick { user mention | user ID} ?{ reason }", a member of the server with the "Moderation" role can kick a user from the server with an optional reason.

### Mute / Unmute

Using ",mute { user mention } ?{ duration } ?{ reason }", a server moderator can add a role to a user which will remove that user's permission to send messages in any channel.

Using ",unmute { user mention }" will remove the "mute" role from the user, allowing them to type again.
