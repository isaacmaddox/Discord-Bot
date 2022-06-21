// Require the necessary discord.js classes
const { EmbedBuilder } = require('@discordjs/builders');
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
var mutedUsers = [];

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    client.user.setActivity('Testing');
    const channel = client.channels.cache.find(c => c.name === "logs");

    if (!channel) return;

    channel.send("**Bot Started**");
})

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(",ban") == 0 || msg.content.indexOf(",unban") == 0 || msg.content.indexOf(",mute") == 0 || msg.content.indexOf(",unmute") == 0) {
        if (!msg.guild.members.cache.find(m => m.id === msg.author.id).roles.cache.find(r => r.name === "Admin")) {
            msg.reply('You need to have <@&988655459613442098> to run this command');
            return;
        }
    }

    if (msg.content.indexOf("help") == 1) { // #TODO: change this to an embed
        msg.reply(`\`\`\`,help ?{ command name }   |   Sends this message, or the message for the specified command.\n\n,ban { user mention | user ID } ?{ reason }   |   Bans the specified user from the guild.\n,unban { user ID }   |   Unbans the specified user from the guild.\n\n? = optional\`\`\``)
    } else if (msg.content.indexOf(',ban') == 0) {
        ban(msg);
    } else if (msg.content.indexOf('unban') == 0) {
        unban(msg);
    } else if (msg.content.indexOf(',mute') == 0) {
        mute(msg);
    } else if (msg.content.indexOf(',unmute') == 0) {
        unmute(msg);
    } else {
        msg.reply('I don\'t recognize that command');
    }
})

client.on('guildMemberAdd', mem => {
    client.channels.cache.find(c => c.name === "general").send(`Welcome, ${mem}!`);
    if (mutedUsers.indexOf(mem.id) > -1) {
        mem.roles.add('988308412234342430');
    }
})

function ban(msg) {
    if (msg.content == ",ban") {
        help("ban", msg);
        return;
    }

    var user = msg.mentions.members.first() !== undefined ? msg.mentions.members.first() : msg.content.split(' ')[1]; // Allow for input of user ID
    var args = msg.content.substring(5, msg.content.length + 1).split(' '); // Get arguments for function
    var rea = msg.content.split(' ')[2] !== undefined ? msg.content.split(' ')[2] : "No reason given"; // Allow for a reason to be given

    if (msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "Admin")) {
        msg.reply(`You cannot ban an Administrator`);
        return;
    }

    if (args.length > 2) { // Put entire ban reason together, if the reason is more than one word.
        for (var i = 2; i < args.length; i++) {
            rea = rea + ' ' + args[i];
        }
    }

    if (msg.author.id === user.id) {
        msg.reply(`You can't ban yourself, stupid`);
        return;
    }


    if (typeof (user) !== "string") {
        user.ban({ rea }).then(() => {
            msg.reply(`${user} banned: ${rea}`);
        }).catch(() => {
            msg.reply(`Cannot ban ${user}`);
        })
    } else {
        try {
            msg.guild.members.ban(user).then(() => {
                msg.reply(`User with ID ${user} banned: ${rea}`);
                msg.channel.send(`https://imgur.com/a/hvKUVUZ`);
            }).catch(() => {
                msg.reply(`Cannot ban user with ID ${user}`);
            })
        } catch (err) {
            msg.reply(`Could not find a user with that ID`);
        }
    }
}

function unban(msg) {
    if (msg.content == ",unban") {
        help("unban", msg);
        return;
    }
    var arg = msg.content.split(' ')[1];
    msg.guild.members.unban(arg).then(() => {
        msg.reply(`Unbanned <@${arg}>`);
    }).catch(() => {
        msg.reply(`Could not ban user with ID ${arg}, is the ID correct?`);
    })
}

function mute(msg) {
    if (msg.content == ",mute") {
        help("mute", msg);
        return;
    }


    let user = msg.mentions.members.first();

    if (!user) { msg.reply(`Could not find user`); return; }

    if (typeof (user) !== "string" && !msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "testing")) {
        try {
            msg.guild.members.cache.find(m => m.id === user.id).roles.add('988308412234342430');
            msg.reply(`Muted ${user}`);
            mutedUsers.push(user.id);
        } catch (err) {
            msg.reply('Dammit it failed');
        }
    } else {
        msg.reply(`${user} is already muted.`);
    }
}

function unmute(msg) {
    if (msg.content == ",unmute") {
        help("unmute", msg);
        return;
    }

    let user = msg.mentions.members.first();

    if (!user) {
        return;
    }

    if (msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "testing")) {
        try {
            user.roles.remove('988308412234342430');
            msg.reply(`Unmuted ${user}`);
            var index = mutedUsers.indexOf(user.id);
            mutedUsers.splice(index, 1);
        } catch (err) {
            msg.reply(`Failed to unmute ${user}`);
        }
    }
}

function help(cmd, msg) {
    switch (cmd) {
        case "ban":
            msg.reply(`\`\`\`,ban { user mention | user ID } ?{ reason }\n\nBans the specified user from the guild.\`\`\``);
            break;
        case "unban":
            msg.reply(`\`\`\`,unban { user ID }\n\nUnbans the specified user from the guild.\`\`\``);
            break;
        case "mute":
            msg.reply('No');
            break;
        case "unmute":
            msg.reply('Unmute');
            break;
    }
}

// Login to Discord with your client's token
client.login(token);