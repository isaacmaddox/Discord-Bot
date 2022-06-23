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

### Warn

Using ",warn { user mention } ?{reason}" will give the specified user a warning. The first warning will send the user a DM telling them the guildelines. Three warnings is an hour-long mute, and four warnings is an automatic ban.

### Report and Appeal

Using ",report" or ",appeal" will create a channel in the "Appeals and Reports" category which is only visible to the person who typed the command and staff members. Staff members can use ",close" to close the channel once it is no longer being used.

### Help

Using ",help" will reply with a generic help menu, listing all the possible commands.

Using ",help { command }" will reply with a specified help menu that contains the syntax for the specified command.

## Rewrite.js

The file rewrite.js included in the folder is simply a re-written version of the regular scripts file. The intended purpose of this file is to make the code more readable. Some changes are being made between the regular scripts file and the re-written one:

### Replies

The bot now replies with embeds instead of plain text messages. This is intended to make the bot's replies stand out more.

### User Mentions / IDs

The updated script will accept either mentions or IDs for every command. This is achieved by dissecting the message mention (i.e. <@123456789012345678>), and stripping it down to just the user ID.

### Mutes

In the new script, the system for keeping track of mute times has been improved. When a user is muted and a time is specified, the timeout is now set as a variable in an array, allowing the timeout to be cleared if the user is manually unmuted during their originally specified mute time.

### "Magic Numbers"

In the original script file, many roles and channels were defined by their IDs within the code, making the program difficult to customize. In the updated version, these values are stored as variables to allow for easier changes to the code.

## Notes

This is my first ever Discord bot, so the code is sloppy and likely prone to crashes. Additionally, the code has been made to be specific to one server, although in the updated version, all server-specific IDs (such as channel and role IDs) will be stored as global variables, allowing anyone to download the code and get their own version of this bot up and running.

## Token Leak

I am aware that in my first commit to this repository I accidentally uploaded my config.json file. I made sure to reset my token ASAP. You can do whatever you want with that token now.
