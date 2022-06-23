// Required variables for discord.js
const { EmbedBuilder } = require('@discordjs/builders');
const { CDN } = require('@discordjs/rest');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { Permissions } = require('discord.js');
const { guildId, token } = require('./config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS] });

// Bot-specific variables
let mutedUsers = [];
const commands = [",1", ",2", ",ban", ",unban", ",mute", ",unmute", ",kick", ",help", ",warn", ",report", ",appeal", ",clear", ",close", ",delete"];
const modCmds = [",ban", ",unban", ",mute", ",unmute", ",kick", ",warn", ",clear", ",close", ",delete"];
let warns = [];
let muteTimes = [];
const insults = ["silly", "stupid", "crazy", "bozo", "idiot", "stoopid", "idot", "bonehead", "dummy"];

// Variables that can change per server
const staffRole = "989022886801072169";
const muteRole = "989021549438861322";
const logs = "989021730469191750";
const welcome = "989022003040243723";
const inv = "https://discord.gg/8NMyWPgNnX";

// Set the bot's status when started
client.once('ready', () => {
    client.user.setActivity(',suckmydick');
})

client.on('guildMemberAdd', member => {
    client.channels.cache.find(c => c.id === welcome).send(`Everyone welcome ${member} to xOvergang!`);
    if (mutedUsers.indexOf(member.id) > -1) {
        member.roles.add(muteRole);
    }
})

// Handle message creation
client.on('messageCreate', msg => {
    let cmd = msg.content.split(' ')[0];

    // If the message is only pinging the bot, reply
    if (cmd === "<@988295746451304489>") { msg.reply("What's up?"); return; }

    // If the message was sent by the bot, or does not start with ",", don't do anything.
    if (msg.author.bot || cmd[0] !== ',') return;

    if (commands.indexOf(cmd) == -1) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `I don't recognize that command`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        })
    }

    // If the command is a staff command, and the user does not have a staff role, don't run the command
    if (modCmds.indexOf(cmd) > -1 && !msg.guild.members.cache.find(m => m.id === msg.author.id).roles.cache.find(r => r.id === staffRole)) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    'You must be a staff member to use this command',
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return;
    }

    // Open the help menu if only the command was sent (And check for command-only commands)
    if (msg.content == cmd && (cmd !== ",report" && cmd !== ",appeal" && cmd !== ",help" && cmd !== ",invite" && cmd !== ",clear")) {
        help(cmd.replace(',', ''), msg);
        return;
    }

    switch (cmd) {
        case ",help":
            help(msg.content.substring(6, msg.content.length), msg);
            break;

        case ",ban":
            ban(msg);
            break;

        case ",unban":
            unban(msg);
            break;

        case ",mute":
            mute(msg);
            break;

        case ",unmute":
            unmute(msg);
            break;

        case ",kick":
            kick(msg);
            break;

        case ",warn":
            warn(msg);
            break;

        case ",report":
            report(msg);
            break;

        case ",appeal":
            appeal(msg);
            break;

        case ",invite":
            invite(msg.channel);
            break;

        case ",clear":
            clear(msg.channel, msg.author);
            break;

        case ",delete":
            del(msg);
            break;
    }
});

function ban(msg) {
    let args = msg.content.replace(',ban ', '').split(' '); // Separate the arguments from the command
    let user = args[0].replace('<@', '').replace('>', ''); // Get the mentioned user's ID
    let reason = "No reason given";

    if (user === msg.author.id) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `You can't ban yourself, ${insults[Math.floor(Math.random() * insults.length)]}.`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        })
        return;
    }

    if (msg.guild.members.cache.get(user).roles.cache.get(staffRole)) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    "You can't ban staff members",
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return;
    }

    // Set the reason for the ban, if any.
    if (args[1] && args[2]) {
        reason = args[1];
        for (var i = 2; i < args.length; i++) {
            reason += ' ' + args[i];
        }
    } else if (args[1])
        reason = args[1];

    msg.guild.members.cache.get(user).send({
        embeds: [
            buildEmbed(
                "#da1212",
                "You have been banned.",
                `${msg.author.tag} banned you`,
                [
                    { name: "Reason", value: reason },
                ],
                { text: "Message Isaac.#0005 for help." },
                false
            )
        ]
    }).catch(() => { // Make sure the bot doesn't crash if a message cannot be sent.
        return;
    })

    setTimeout(() => {
        msg.guild.members.cache.get(user).ban({ reason }).then(() => {
            client.channels.cache.get(logs).send({
                embeds: [
                    buildEmbed(
                        "#da1212",
                        `Event: Ban (${user})`,
                        `<@${user}> banned`,
                        [
                            { name: "Reason", value: reason },
                            { name: "Moderator", value: msg.author.tag }
                        ],
                        { text: "xOvermod by Isaac Maddox. ,help", },
                        false
                    )
                ]
            })

            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        `Banned ${user}`,
                        "",
                        [],
                        null,
                        true
                    )
                ]
            }).catch(err => {
                console.log(err);
            })
        }).catch((err) => {
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        `Cannot ban this user`,
                        "",
                        [],
                        null,
                        true
                    )
                ]
            }).catch(err => {
                console.log(err);
            })
        })
    }, 500) // Add delay to ensure the message is sent to the user.
}

function unban(msg) {
    let args = msg.content.replace(',unban ', '').split(' '); // Separate the arguments from the command
    let user = args[0].replace('<@', '').replace('>', ''); // Get the mentioned user's ID

    msg.guild.members.unban(user).then(() => {
        msg.guild.channels.cache.find(c => c.id === logs).send({
            embeds: [
                buildEmbed(
                    "#20add8",
                    `Event: Unban (${user})`,
                    `<@${user}> unbanned`,
                    [
                        { name: "Moderator", value: msg.author.tag }
                    ],
                    { text: "xOvermod by Isaac Maddox. ,help", },
                    false
                )
            ]
        })

        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `Unbanned ${user}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        })
    }).catch((err) => {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `Invalid user ID: ${user}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        console.log(err);
    });
}

function kick(msg) {
    let args = msg.content.replace(',kick ', '').split(' '); // Separate the arguments from the command
    let user = args[0].replace('<@', '').replace('>', ''); // Get the mentioned user's ID
    let reason = msg.content.substring((msg.content.indexOf(user) + user.length + 2), msg.content.length);
    if (reason == "" || reason == " ")
        reason = "No reason given.";

    if (user === msg.author.id) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `You can't kick yourself, ${insults[Math.floor(Math.random() * insults.length)]}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        })
        return;
    }

    try {
        msg.guild.members.cache.find(m => m.id === user).send({
            embeds: [
                buildEmbed(
                    "#da1212",
                    "You have been kicked",
                    `${msg.author.tag} kicked you`,
                    [
                        { name: "Reason", value: `${reason}` },
                    ],
                    { text: "Message Isaac.#0005 for help", }
                )
            ]
        }).catch(() => {
            return;
        })
    } catch {
        console.log("e");
    }

    setTimeout(() => {
        msg.guild.members.cache.get(user).kick({ reason }).then(() => {
            msg.guild.channels.cache.find(c => c.name === "logs").send({
                embeds: [
                    buildEmbed(
                        "#da1212",
                        "Event: Kick",
                        `${user} kicked`,
                        [
                            { name: "Reason", value: `${reason}` },
                            { name: "Moderator", value: msg.author.tag }
                        ],
                        { text: "xOvermod by Isaac Maddox. ,help", }
                    )
                ]
            })

            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        `Kicked member: ${reason}`,
                        `<@${user}> kicked`,
                        [],
                        null,
                        true
                    )
                ]
            })
        })
    }, 500);
}

function mute(msg) {
    let args = msg.content.replace(',mute ', '').split(' '); // Separate the arguments from the command
    let user = args[0].replace('<@', '').replace('>', ''); // Get the mentioned user's ID
    let time = "";
    let reason = "No reason given";
    let setTime;
    const timeReg = new RegExp("[0-9]+[smh]");

    if (!msg.guild.members.cache.find(m => m.id === user)) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    "I couldn't find that user",
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return;
    };

    if (msg.guild.members.cache.find(m => m.id === user).roles.cache.find(r => r.id === muteRole)) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    "User is already muted",
                    "",
                    [],
                    null,
                    true
                )
            ]
        }); return
    };

    if (user === msg.author.id) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `You can't mute yourself, ${insults[Math.floor(Math.random() * insults.length)]}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return
    };

    if (msg.guild.members.cache.find(m => m.id === user).roles.cache.find(r => r.id === staffRole)) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    "You can't mute a staff member",
                    "",
                    [],
                    null,
                    true
                )
            ]
        }); return
    };

    if (args[1] && timeReg.test(args[1])) { // ,mute @user 20m...
        setTime = parseInt(args[1].substring(0, args[1].length - 1));

        switch (args[1][args[1].length - 1]) {
            case "s":
                time = `${setTime} second${setTime > 1 ? "s" : ""}`;
                setTime *= 1000;
                break;
            case "m":
                time = `${setTime} minute${setTime > 1 ? "s" : ""}`;
                setTime *= 60000;
                break;
            case "h":
                time = `${setTime} hour${setTime > 1 ? "s" : ""}`;
                setTime *= 3600000;
                break;
        }

        if (args[2]) {
            reason = msg.content.substring(msg.content.indexOf(args[1]) + args[1].length + 1, msg.content.length);
        }

    } else if (args[1]) { // ,mute @user reason...
        reason = msg.content.substring(msg.content.indexOf(args[1]), msg.content.length);
    }

    msg.guild.members.cache.find(m => m.id === user).roles.add(muteRole);
    mutedUsers.push(user);

    if (setTime) {

        let handle = setTimeout(() => {
            unmute(user);
        }, setTime);

        var createTimer = new muteTimer(handle, user);

        muteTimes.push(createTimer);

        msg.guild.channels.cache.find(c => c.id === logs).send({
            embeds: [
                buildEmbed(
                    "#da1212",
                    `Event: Mute (${user}`,
                    `<@${user}> muted`,
                    [
                        { name: "Duration", value: time }, { name: "Reason", value: reason }, { name: "Moderator", value: msg.author.tag }
                    ],
                    { text: "xOvermod by Isaac Maddox. ,help", },
                    false
                )
            ]
        })

        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `User muted for ${time}: ${reason}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        }).catch(err => {
            console.log(err);
        })
    } else {
        msg.guild.channels.cache.find(c => c.id === logs).send({
            embeds: [
                buildEmbed(
                    "#da1212",
                    `Event: Mute (${user})`,
                    `<@${user}> muted`,
                    [
                        { name: "Reason", value: reason }, { name: "Moderator", value: msg.author.tag }
                    ],
                    { text: "xOvermod by Isaac Maddox. ,help", },
                    false
                )
            ]
        })

        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `User muted: ${reason}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        }).catch(err => {
            console.log(err);
        })
    }
}

function unmute(msg) {
    if (typeof (msg) === "string") {
        let user = msg; // Get the mentioned user's ID

        if (!client.guilds.cache.get(guildId).members.cache.find(m => m.id === user)) { return; };
        if (!client.guilds.cache.get(guildId).members.cache.find(m => m.id === user).roles.cache.find(r => r.id === muteRole)) { return; };

        client.guilds.cache.get(guildId).members.cache.find(m => m.id === user).roles.remove(muteRole);

        var obj = muteTimes.find(t => t.user === user);
        var ind = muteTimes.indexOf(obj);

        muteTimes.splice(ind, 1);

        ind = mutedUsers.indexOf(user);
        mutedUsers.splice(ind, 1);

        client.guilds.cache.get(guildId).channels.cache.get(logs).send({
            embeds: [
                buildEmbed(
                    "#20add8",
                    `Event: Unmute (${user})`,
                    `<@${user}> unmuted (Automatic)`,
                    [
                        { name: "Moderator", value: "xOvermod#3621" }
                    ],
                    { text: "xOvermod by Isaac Maddox. ,help", },
                    false
                )
            ]
        })

    } else {
        let args = msg.content.replace(',unmute ', '').split(' '); // Separate the arguments from the command
        let user = args[0].replace('<@', '').replace('>', ''); // Get the mentioned user's ID

        msg.guild.members.cache.find(m => m.id === user).roles.remove(muteRole);

        var obj = muteTimes.find(t => t.user === user);
        let ind;
        if (obj) {
            ind = muteTimes.indexOf(obj);

            clearTimeout(obj.timer);

            muteTimes.splice(ind, 1);
        }

        ind = mutedUsers.indexOf(user);
        mutedUsers.splice(ind, 1);


        client.guilds.cache.get(guildId).channels.cache.get(logs).send({
            embeds: [
                buildEmbed(
                    "#20add8",
                    `Event: Unmute (${user})`,
                    `<@${user}> unmuted`,
                    [
                        { name: "Moderator", value: msg.author.tag }
                    ],
                    { text: "xOvermod by Isaac Maddox. ,help", },
                    false
                )
            ]
        })

        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `Unmuted user`,
                    `<@${user}> unmuted`,
                    [],
                    null,
                    true
                )
            ]
        }).catch(err => {
            console.log(err);
        })
    }
}

function warn(msg) {
    let args = msg.content.replace(',warn ', '').split(' '); // Separate the arguments from the command
    let user = args[0].replace('<@', '').replace('>', ''); // Get the mentioned
    let reason = msg.content.trim().substring(msg.content.indexOf(user) + user.length + 2, msg.content.length);
    let mod = msg.author.tag;
    if (reason == "") {
        reason = "No reason given";
    }

    if (user === msg.author.id) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `You can't warn yourself, ${insults[Math.floor(Math.random() * insults.length)]}`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return;
    }

    if (msg.guild.members.cache.get(user).roles.cache.get(staffRole)) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `You can't warn a staff member`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return;
    }

    let obj = warns.find(mem => mem.id === user); // Find if the user already has warnings

    if (!obj) { // Create a new User object if none is found in the list
        let newWarn = new User(user);
        warns.push(newWarn);
        obj = warns[warns.length - 1];
    }

    let info = new warnMsg(mod, reason);

    obj.messages.push(info);

    if (obj.messages.length == 1) {
        msg.guild.members.cache.get(user).send({
            embeds: [
                buildEmbed(
                    "#E49700",
                    "Warning",
                    "You have received a warning. Your third warning will result in an hour-long mute, and your fourth warning will result in a ban",
                    [
                        { name: "Warning Message", value: obj.messages[0].msg },
                        { name: "Moderator", value: obj.messages[0].mod },
                    ],
                    { text: "Message Isaac.#0005 or another staff member for help", }
                )
            ]
        })
    } else if (obj.messages.length == 3) {
        msg.guild.members.cache.get(user).send({
            embeds: [
                buildEmbed(
                    "#da1212",
                    "Auto-Mute",
                    "You have been automatically muted for hitting 3 warnings. Another warning will result in a ban.",
                    [
                        { name: "Warning 1", value: obj.messages[0].mod + " - " + obj.messages[0].msg },
                        { name: "Warning 2", value: obj.messages[1].mod + " - " + obj.messages[1].msg },
                        { name: "Warning 3", value: obj.messages[2].mod + " - " + obj.messages[2].msg },
                    ],
                    { text: "Message Isaac.#0005 or another staff member for help", }
                )
            ]
        });

        msg.content = `,mute ${user} 1h 3 Warnings`;
        msg.author = client.user;

        mute(msg);
    } else if (obj.messages.length == 4) {
        msg.guild.members.cache.get(user).send({
            embeds: [
                buildEmbed(
                    "#da1212",
                    "Auto-Ban",
                    "You have been automatically banned from xOvergang for hitting 4 warnings",
                    [
                        { name: "Warning 1", value: obj.messages[0].mod + " - " + obj.messages[0].msg },
                        { name: "Warning 2", value: obj.messages[1].mod + " - " + obj.messages[1].msg },
                        { name: "Warning 3", value: obj.messages[2].mod + " - " + obj.messages[2].msg },
                        { name: "Warning 4", value: obj.messages[3].mod + " - " + obj.messages[3].msg },
                    ],
                    { text: "Message Isaac.#0005 for help", }
                )
            ]
        });

        msg.content = `,ban ${user} 4 Warnings`;
        msg.author = client.user;

        ban(msg);
    }
}

function help(cmd, msg) {
    if (cmd == "") {
        cmd = "all";
    }
    switch (cmd) {
        case "ban":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Ban",
                        "Bans the specified user",
                        [
                            { name: "Syntax", value: "```,ban { user mention } ? { reason }```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "unban":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Unban",
                        "Revokes the ban of the specified user",
                        [
                            { name: "Syntax", value: "```,unban { user ID }```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "mute":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Mute",
                        "Mutes the specified user, removing their permission to send messages",
                        [
                            { name: "Syntax", value: "```,mute { user mention } ? { duration } ? { reason }```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "unmute":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Unmute",
                        "Unmutes specified user",
                        [
                            { name: "Syntax", value: "```,unmute { user mention }```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "kick":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Kick",
                        "Kicks specified user",
                        [
                            { name: "Syntax", value: "```,kick { user mention }```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "warn":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Warn",
                        "Gives a warning to the specified user. Three warnings results in a hour-long mute, and four warnings results in an automatic ban",
                        [
                            { name: "Syntax", value: "```,warn { user mention } { message }```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "all":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help (1 / 2)",
                        "Moderation commands.",
                        [
                            { name: "Ban", value: "Bans the specified user." },
                            { name: "Unban", value: "Unbans the specified user." },
                            { name: "Kick", value: "Kicks the specified user." },
                            { name: "Mute", value: "Mutes the specified user." },
                            { name: "Unmute", value: "Unmutes the specified user." },
                            { name: "Warn", value: "Gives a warning to the specified user." },
                            { name: "Clear", value: "Clears the messages in the channel" },
                            { name: "Delete", value: "Deletes a specific number of messages from the channel" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "appeal":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Appeal",
                        "Opens a new channel in which you can appeal a staff decision.",
                        [
                            { name: "Syntax", value: "```,appeal```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "report":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Report",
                        "Creates a new channel in which you can report a user.",
                        [
                            { name: "Syntax", value: "```,report```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "clear":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Clear",
                        "Clears the messages in the channel to which the command is sent",
                        [
                            { name: "Syntax", value: "```,clear```" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
        case "1":
            help("all", msg);
            break;
        case "2":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help (2 / 2)",
                        "Generic commands.",
                        [
                            { name: "Report", value: "Open a report channel" },
                            { name: "Appeal", value: "Appeal a staff decision" },
                            { name: "Invite", value: "Send the server invite in the current channel" },
                        ],
                        { text: "Type ,help { command } for more help" },
                        true
                    )
                ]
            });
            break;
    }
}

function invite(chan) {
    chan.send(inv);
}

function clear(channel, author) {
    empty = false;
    channel.bulkDelete(50).then(() => {
        channel.messages.fetch({ limit: 100 }).then((msgs) => {
            if (msgs.size == 0) {
                client.guilds.cache.get(guildId).channels.cache.get(logs).send({
                    embeds: [
                        buildEmbed(
                            "#20add8",
                            `Cleared ${channel.name}`,
                            `${author} cleared ${channel.name}`,
                            [],
                            { text: "xOvermod by Isaac Maddox. ,help", },
                            false
                        )
                    ]
                });
                channel.send({
                    embeds: [
                        buildEmbed(
                            "#2F3136",
                            "Cleared channel",
                            "",
                            [],
                            null,
                            true
                        )
                    ]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete()
                    }, 5000);
                })
                empty = true;
            }
        })
        if (empty)
            return;
        clear(channel, author);
    }).catch(() => {
        channel.send({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    "Cannot delete any more messages",
                    "",
                    [],
                    null,
                    true
                )
            ]
        })
    })
}

function del(msg) {
    let number = parseInt(msg.content.substring(7, msg.content.length));
    if (!number || number == NaN) {
        msg.reply({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `Please provide a valid number of messages to delete (1-100)`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
        return;
    }

    if (number > 99)
        number = 99;

    msg.channel.bulkDelete(number + 1).then(() => {
        msg.channel.send({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `Deleted ${number} messages.`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
    }).catch(() => {
        msg.channel.send({
            embeds: [
                buildEmbed(
                    "#2F3136",
                    `Unable to delete messages`,
                    "",
                    [],
                    null,
                    true
                )
            ]
        });
    })

    msg.guild.channels.cache.get(logs).send({
        embeds: [
            buildEmbed(
                "#20add8",
                `messages deleted in ${msg.channel.name}.`,
                `${msg.author.tag} deleted ${number} messages.`,
                [],
                { text: "xOvermod by Isaac Maddox. ,help", },
                false
            )
        ]
    })
}

function buildEmbed(color, title, description, fields, footer, removeTimestamp) {
    for (var i = 0; i < fields.length; i++) {
        fields[i].value = "> " + fields[i].value;
    }

    const embed = new MessageEmbed()
        .setColor(color)
        .setURL(null)
        .setTitle(title)
        .setDescription(description)
        .setFields(fields)
        .setFooter(footer)

    if (!removeTimestamp)
        embed.setTimestamp();

    return embed;
}

function muteTimer(timer, user) {
    this.timer = timer;
    this.user = user;
}

function User(id) {
    this.id = id;
    this.messages = [];
}

function warnMsg(mod, msg) {
    this.mod = mod;
    this.msg = msg;
}

client.login(token);