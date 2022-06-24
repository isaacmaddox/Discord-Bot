# xOvermod

## About the bot

This is my first ever Discord bot, made using Node, discord.js, and discord.js dependencies. It is intended to function as a moderation bot on my personal Discord server ([Join Here](https://discord.gg/8NMyWPgNnX)). The bot has basic moderation functions, as well as other miscellaneous features.

## Syntax

The bot prefix is `,`. Baisc command syntax is

```
,command { user } { arguments }
```

This bot accepts both user mentions (i.e. @user), or user IDs (i.e. 123456789012345678) for all commands which affect a user. To find the arguments for any given command, type `,help { command }`. The bot will reply with an embed detailing the command and its syntax.

When the syntax is provided (both in this README and in embeds), `?` before an argument represents an optional value.

## Commands

This bot is heavy on moderation, so there are very few commands that can be used by everyone. The commands that are not moderator-specific are marked with a *.

### `,ban` and `,unban`

These do exactly what it sounds like they do. `,ban` takes two arguments: user and an optional reason. `,unban`, on the other hand, only takes the user

### `,mute` and `,unmute`

These two are also very self-explanatory. `,mute` takes three arguments: user, an optional duration (in seconds, minutes, or hours), and an optional reason. `,unmute` only takes one argument: the user.

### `,kick`

This command will kick the user from the server. It takes two arguments: user and an optional reason.

### *`,help`

The `,help` command can be a standalone command, or it can take in one argument, which is a command. Running only `,help` will return the first page of the help menu, which is dedicated to moderator commands. `,help 1` will also do the same. `,help 2` will open the second page, and `,help { command }` will return the help menu for the requested command.

### `,warn`

The `,warn` command takes two arguments: user and an optional reason. This command will give the specified user a warning. The first warning will send the user a DM informing them of how warnings work: three warnings is an automatic hour-long mute, and four warnings is an automatic ban. When the user hits three or four warnings, they also receive a DM from the bot telling them what happened.

I also intend to add `,warn list { user }` to this command, allowing moderators to view the warnings that a user has.
Additionally, `,warn remove { user } { number }` will be a command. Specifics will be worked out in the future.

### *`,report` and *`,appeal`

These commands will open up a channel in the "Reports and Appeals" category that is only visible to the user who opens the channel and staff members.

The channels will look something like this:

![image](https://user-images.githubusercontent.com/92178904/175566038-386ac566-0c57-4177-8169-451bdd4156c4.png)

Both the user and staff members are pinged to ensure that the issue is taken care of as soon as possible.

### `,clear` and `,delete`

The `,clear` command is moderator-only, and will clear all of the messages in the channel up to two weeks old.

The `,delete` command, however, takes an integer amount and deletes that many messages in the current channel.

### `,close`

`,close` is a function intended to work alongside `,report` and `,appeal`. If a moderator runs this commmand in a report or appeal channel, the channel will be closed.

### `,invite`

`,invite` responds with the invite link to the server.

### `,potato` (also `,p`)

Starts a game of hot potato. Keep reading to learn more.

### `,git`

Responds with the link to this github repository.

## The re-write

The code for this bot used to be a lot more compact, but this made it harder to read. I decided to go through and re-write the code to make it a lot easier to comprehend at first glance. While doing so, I also ended up making a few improvments and changes:

### User

The bot now accepts both user mentions and user IDs for every command, whereas before it would only accept one type per command. This is done by dissecting the mention. In discord, a mention is formatted as `<@123456789012345678>`. Simply removing the `<@` and `>` give just the user's ID.

### Help handling

The bot will now check to see if a command was sent without any arguments. If the command is meant to have arguments, the bot will provide the user with the help menu for that command.

### "Magic Numbers"

In the first release of the bot, there were numbers all throughout the code that only applied to the server I was developing in. Predictably, this made switching servers far too difficult. In the new version, all server-specific values (i.e. role IDs, channel IDs) are stored in a group of variables at the very top of the file.

### Compression

The main purpose of re-writing the bot was to make the code alltogether smaller and easier to read. While I accomplished the latter, the former is far in the rear view mirror. However, with new lines comes new features!

While the whole file might not have become smaller, certain functions definitely did. With the help of [Francis Chua](https://github.com/tweoss), the `,clear` command function went from this:

![image](https://user-images.githubusercontent.com/92178904/175559207-657fb0be-3e2b-4779-bb8d-40becbdc0920.png)

to this:

![image](https://user-images.githubusercontent.com/92178904/175559408-1ed2ffac-43f9-49be-9ea4-51572e506b37.png)

## Other commands and features

I also added some new commands and features to the bot while I was rewriting the code.

### `,clear`

The `,clear` command takes no arguments, and will completely empty the channel to which it is sent. Of course, it is a moderator-only command.

### `,delete { count }`

The `,delete` command takes a valid integer and deletes the specified number of messages from the channel the command was sent to. Like `,clear`, it is a moderator-only command.

### `,invite`

The `,invite` command replies to the calling message with a link to the server. This link is set through the server-specific variables mentioned before.

### `,potato`

I noticed that the bot was only good for use by the moderators of the server, really. So I decided that I would add a "game" of sorts to the bot. When a user types either `,potato { user }` or `,p { user }`, a game of hot potato is started. The game lasts 1 minute, and the last to have the potato loses, gaining the "POTATO HEAD" role.

The rules of the game are simple: 
You cannot pass the potato to:


(1) The user who passed it to you;


(2) Any offline or invisible user;


(3) The bot;


(4) Yourself.

### `,git`

Running the `,git` command replies to the message with the link to this repository.
