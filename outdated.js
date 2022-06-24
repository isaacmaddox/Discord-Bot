// Commands I want to have:
// - ban
// - unban
// - mute
// - unmute
// - kick
// - help
// - 

// Require the necessary discord.js classes
const { EmbedBuilder } = require('@discordjs/builders');
const { CDN } = require('@discordjs/rest');
const { Client, Intents, MessageEmbed, Message } = require('discord.js');
const { Permissions } = require('discord.js');
const { token } = require('./config.json');
var mutedUsers = [];
var commands = [
    "1",
    "2",
    "ban",
    "unban",
    "mute",
    "unmute",
    "kick",
    "help",
    "warn"
]
var warns = [];

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MEMBERS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    client.user.setActivity(',help');

    // client.channels.cache.find(c => c.name === "rules").send({
    //     embeds: [
    //         buildEmbed(
    //             "#070B0F",
    //             "Rules",
    //             "Always follow these rules when in the server, **and when in DMs with server staff.**",
    //             [
    //                 { name: "1. No NSFW", value: "Absolutely no NSFW content is allowed.\nPosting NSFW will result in an immediate ban." },
    //                 { name: "2. Be curteous", value: "We're all just here to have fun, there's no need to get hostile. Keep that for party chat." },
    //                 { name: "3. Do not spam", value: "Yes, sending messages in rapid succession counts. We want people to be able to read the chat." },
    //                 { name: "4. Staff decisions are final", value: "You can make an appeal using `,appeal`, but do not DM staff or xOvernight to complain about a decision." },
    //                 { name: "5. Do not abuse the system", value: "This bot is custom-made by xOvernight, and thus will probably have some issues. If you see an issue, please use `,report` rather than abusing the issue, or making it know to the public." },
    //             ],
    //             { text: "Message any Staff member with questions!" }
    //         )
    //     ]
    // })
})

client.on('messageCreate', msg => {

    if (msg.content == "<@988295746451304489>") {
        msg.reply("What do you need?");
        return;
    }

    if (msg.author.bot || msg.content[0] !== ",") return;
    if (msg.content.indexOf(",ban") == 0 || msg.content.indexOf(",unban") == 0 || msg.content.indexOf(",mute") == 0 || msg.content.indexOf(",unmute") == 0 || msg.content.indexOf(",kick") == 0) {
        if (!msg.guild.members.cache.find(m => m.id === msg.author.id).roles.cache.find(r => r.name === "Admin")) {
            msg.reply('https://tenor.com/view/shannon-sharpe-shay-nope-nah-nuhuh-gif-12298561');
            return;
        }
    }

    if (msg.content.indexOf(",help") == 0) {
        if (msg.content == ",help") {
            help("all", msg);
        } else {
            let cmd = msg.content.split(' ')[1].toLowerCase();
            if (commands.indexOf(cmd) > -1) {
                help(cmd, msg);
            } else {
                msg.reply('I don\'t regognize that command');
            }
        }
    } else if (msg.content.indexOf(',ban') == 0) {
        ban(msg);
    } else if (msg.content.indexOf(',unban') == 0) {
        unban(msg);
    } else if (msg.content.indexOf(',mute') == 0) {
        mute(msg);
    } else if (msg.content.indexOf(',unmute') == 0) {
        unmute(msg, false);
    } else if (msg.content.indexOf(',kick') == 0) {
        kick(msg);
    } else if (msg.content.indexOf(',warn') == 0) {
        warn(msg);
    } else if (msg.content.indexOf(',appeal') == 0) {
        appeal(msg);
    } else if (msg.content.indexOf(',close') == 0 && msg.guild.members.cache.find(m => m.id === msg.author.id).roles.cache.has('989022886801072169') && (msg.channel.name.indexOf("-appeal") > -1 || msg.channel.name.indexOf("-report") > -1)) {
        closeappeal(msg);
    } else if (msg.content.indexOf(",report") == 0) {
        report(msg);
    } else {
        msg.reply('I don\'t recognize that command');
    }
})

client.on('guildMemberAdd', mem => {
    client.channels.cache.find(c => c.name === "welcome").send(`Everyone welcome ${mem} to xOvergang!`);
    if (mutedUsers.indexOf(mem.id) > -1) {
        mem.roles.add('989021549438861322');
    }
})

function ban(msg) {
    if (msg.content == ",ban") {
        help("ban", msg);
        return;
    }

    var user = msg.mentions.members.first() !== undefined ? msg.mentions.members.first() : msg.content.split(' ')[1]; // Allow for input of user ID
    if (typeof (user) === "string") {
        msg.reply('Not a valid user');
        return;
    }
    var args = msg.content.substring(5, msg.content.length + 1).split(' '); // Get arguments for function
    var rea = msg.content.split(' ')[2] !== undefined ? msg.content.split(' ')[2] : "No reason given"; // Allow for a reason to be given

    if (msg.author.id === user.id) {
        msg.reply(`You can't ban yourself, stupid`);
        return;
    }

    if (msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "Admin")) {
        msg.reply(`You cannot ban an Administrator`);
        return;
    }

    if (args.length > 2) { // Put entire ban reason together, if the reason is more than one word.
        for (var i = 2; i < args.length; i++) {
            rea = rea + ' ' + args[i];
        }
    }


    if (typeof (user) !== "string") {
        user.send({
            embeds: [
                buildEmbed(
                    "#da1212",
                    "You have been banned",
                    `${msg.author.tag} banned you`,
                    [
                        { name: "Reason", value: rea },
                        { name: "Moderator", value: msg.author.tag }
                    ],
                    { text: "Message Isaac.#0005 for help", }
                )
            ]
        })
        setTimeout(() => {
            user.ban({ rea }).then(() => {
                msg.reply(`${user} banned: ${rea}`);
                msg.guild.channels.cache.find(c => c.name === "logs").send({
                    embeds: [
                        buildEmbed(
                            "#da1212",
                            "Event: Ban",
                            `${user} banned`,
                            [
                                { name: "Reason", value: rea },
                                { name: "Moderator", value: msg.author.tag }
                            ],
                            { text: "xOvermod by Isaac Maddox. ,help", }
                        )
                    ]
                });
            }).catch(() => {
                msg.reply(`Cannot ban ${user}`);
            })
        }, 500)
    } else {
        msg.reply("Please mention the user to mute them.");
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
        msg.guild.channels.cache.find(c => c.name === "logs").send({
            embeds: [
                buildEmbed(
                    "#20add8",
                    "Event: Unban",
                    `${arg} unbanned`,
                    [
                        { name: "Moderator", value: msg.author.tag }
                    ],
                    { text: "xOvermod by Isaac Maddox. ,help", }
                )
            ]
        });
    }).catch((err) => {
        msg.reply(`Incorrect user ID: ${arg}`);
    })
}

function mute(msg) {
    if (msg.content == ",mute") {
        help("mute", msg);
        return;
    }


    let user = msg.mentions.members.first();
    let args = msg.content.substring(6, msg.content.length).split(' ');

    let ti = "";
    let reason = "No reason given";
    let setTime;
    const time = new RegExp("[0-9]+[smh]");
    if (args[1]) {
        setTime = parseInt(args[1].substring(0, args[1].length - 1));

        if (args[1] && time.test(args[1])) {
            switch (args[1][args[1].length - 1]) {
                case "s":
                    ti = `${setTime} second${setTime > 1 ? "s" : ""}`;
                    setTime *= 1000;
                    break
                case "m":
                    ti = `${setTime} minute${setTime > 1 ? "s" : ""}`;
                    setTime *= 60000;
                    break;
                case "h":
                    ti = `${setTime} hour${setTime > 1 ? "s" : ""}`;
                    setTime *= 3600000;
                    break;
            }
        } else if (args[1] && !args[2]) {
            reason = args[1];
        } else if (args[1] && args[2]) {
            reason = args[1];
            for (var i = 2; i < args.length; i++) {
                reason += ' ' + args[i];
            }
        }


        if (args[1] && time.test(args[1]) && args[2] && !args[3]) {
            reason = args[2];
        } else if (args[1] && time.test(args[1]) && args[2] && args[3]) {
            reason = args[2];
            for (var i = 3; i < args.length; i++) {
                reason += ' ' + args[i];
            }
        }
    }

    if (!user) { msg.reply(`Could not find user`); return; }

    if (typeof (user) !== "string" && !msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "testing")) {
        try {
            msg.guild.members.cache.find(m => m.id === user.id).roles.add('989021549438861322');
            mutedUsers.push(user.id);

            if (setTime) {
                setTimeout(() => {
                    unmute(msg, true);
                }, setTime);
                msg.reply(`Muted ${user} for ${ti}: ${reason}`);
                // msg.guild.channels.cache.find(c => c.name === "logs").send(`${user} muted for ${ti}: ${reason}\n**Responsible moderator:** ${msg.author.tag}`);
                msg.guild.channels.cache.find(c => c.name === "logs").send({
                    embeds: [buildEmbed(
                        "#da1212",
                        "Event: Mute",
                        `${user} muted`,
                        [{ name: "Duration", value: ti }, { name: "Reason", value: reason }, { name: "Moderator", value: msg.author.tag }],
                        { text: "xOvermod by Isaac Maddox. ,help", })]
                });
            } else {
                msg.reply(`Muted ${user}: ${reason}`);
                // msg.guild.channels.cache.find(c => c.name === "logs").send(`${user} muted: ${reason}\n**Responsible moderator:** ${msg.author.tag}`);

                msg.guild.channels.cache.find(c => c.name === "logs").send({
                    embeds: [buildEmbed(
                        "#da1212",
                        "Event: Mute",
                        `${user} muted`,
                        [{ name: "Reason", value: reason }, { name: "Moderator", value: msg.author.tag }],
                        { text: "xOvermod by Isaac Maddox. ,help", })]
                });
            }


        } catch (err) {
            msg.reply('Could not mute that user.');
            console.log(err);
        }
    } else {
        msg.reply(`${user} is already muted.`);
    }
}

function unmute(msg, auto) {
    if (msg.content == ",unmute") {
        help("unmute", msg);
        return;
    }


    let user = msg.mentions.members.first();

    if (!user) {
        return;
    }

    if (auto && mutedUsers.indexOf(user.id) == -1) {
        return;
    }

    if (!msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "testing")) {
        msg.reply('User is not muted');
        return;
    }

    if (msg.guild.members.cache.find(m => m.id === user.id).roles.cache.find(r => r.name === "testing")) {
        try {
            user.roles.remove('989021549438861322')
            if (!auto) {
                msg.reply(`Unmuted ${user}`);
                msg.guild.channels.cache.find(c => c.name === "logs").send({
                    embeds: [
                        buildEmbed(
                            "#20add8",
                            "Event: Unmute",
                            `${user} unmuted`,
                            [
                                { name: "Moderator", value: `${msg.author.tag}` }
                            ],
                            { text: "xOvermod by Isaac Maddox. ,help", }
                        )
                    ]
                });
            } else {
                msg.guild.channels.cache.find(c => c.name === "logs").send({
                    embeds: [
                        buildEmbed(
                            "#20add8",
                            "Event: Unmute",
                            `${user} unmuted automatically`,
                            [],
                            { text: "xOvermod by Isaac Maddox. ,help", }
                        )
                    ]
                });
                var index = mutedUsers.indexOf(user.id);
                mutedUsers.splice(index, 1);
            }
        } catch (err) {
            msg.reply(`Failed to unmute ${user}`);
            console.log(err);
        }
    }
}

function kick(msg) {
    if (msg.content === ",kick") {
        help("kick", msg);
        return;
    }

    var user = msg.mentions.members.first()
    if (!user) return;
    var reason = msg.content.substring((msg.content.indexOf(user.id) + user.id.length + 2), msg.content.length);

    if (user.id === msg.author.id) {
        msg.reply(`You can't kick yourself, silly.`);
        return;
    }

    user.send({
        embeds: [
            buildEmbed(
                "#da1212",
                "You have been kicked",
                `${msg.author.tag} kicked you`,
                [
                    { name: "Reason", value: `${reason}` },
                    { name: "Moderator", value: msg.author.tag }
                ],
                { text: "Message Isaac.#0005 for help", }
            )
        ]
    }).catch(() => {
        return;
    })

    setTimeout(() => {

        msg.guild.members.cache.find(m => m.id === user.id).kick({ reason }).then(() => {
            msg.reply(`Kicked ${user}: ${reason}`);
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
        })
    }, 500);
}

function help(cmd, msg) {

    switch (cmd) {
        case "ban":
            // msg.reply(`\`\`\`,ban { user mention | user ID } ?{ reason }\n\nBans the specified user from the guild.\`\`\``);
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help: Ban",
                        "Bans the specified user",
                        [
                            { name: "Syntax", value: "```,ban { user mention } ?{ reason }```" },
                        ],
                        { text: "Type ,help { command } for more help" }
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
                        { text: "Type ,help { command } for more help" }
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
                            { name: "Syntax", value: "```,mute { user mention } ?{ duration } ?{ reason }```" },
                        ],
                        { text: "Type ,help { command } for more help" }
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
                        { text: "Type ,help { command } for more help" }
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
                        { text: "Type ,help { command } for more help" }
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
                        { text: "Type ,help { command } for more help" }
                    )
                ]
            });
        case "all":
            msg.reply({
                embeds: [
                    buildEmbed(
                        "#2F3136",
                        "Help",
                        "All commands. (1 / 2)",
                        [
                            { name: "Ban", value: "Bans the specified user." },
                            { name: "Unban", value: "Unbans the specified user." },
                            { name: "Kick", value: "Kicks the specified user." },
                            { name: "Mute", value: "Mutes the specified user." },
                            { name: "Unmute", value: "Unmutes the specified user." },
                            { name: "Warn", value: "Gives a warning to the specified user." },
                        ],
                        { text: "Type ,help { command } for more help" }
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
                        "Help",
                        "All commands. (2 / 2)",
                        [
                            { name: "Report", value: "Open a report channel" },
                            { name: "Appeal", value: "Appeal a staff decision" },
                        ],
                        { text: "Type ,help { command } for more help" }
                    )
                ]
            });
            break;
    }
}

function warn(msg) {
    if (msg.content === ",warn") {
        help("warn", msg);
        return;
    }

    let user = msg.mentions.members.first();
    if (user == undefined) return;
    let warning = msg.content.substring(msg.content.indexOf(user.id) + user.id.length + 2, msg.content.length);

    msg.reply(`${user} has been warned: ${warning}`);

    msg.guild.channels.cache.find(c => c.name === "logs").send({
        embeds: [
            buildEmbed(
                "#E49700",
                "Event: Warn",
                `${user} has been warned`,
                [
                    { name: "Warning Message", value: warning },
                    { name: "Moderator", value: msg.author.tag }
                ],
                { text: "xOvermod by Isaac Maddox. ,help", }
            )
        ]
    }).then(() => {
        warning = msg.author.tag + 'xOvermod_split' + warning;
        let obj = warns.find(mem => mem.id === user.id);
        if (!obj) {
            let newUser = new User(user.id);
            warns.push(newUser);
            obj = warns[warns.length - 1];
        }
        obj.messages.push(warning);
        if (obj.messages.length == 3) {
            msg.guild.members.cache.find(m => m.id === obj.id).roles.add('989021549438861322');
            msg.guild.channels.cache.find(c => c.name === "logs").send({
                embeds: [
                    buildEmbed(
                        "#da1212",
                        "Event: Auto-Mute",
                        `<@${user.id}> muted automatically`,
                        [
                            { name: "Duration", value: "1 hour" },
                            { name: "Reason", value: "Too many warnings" }
                        ],
                        { text: "xOvermod by Isaac Maddox. ,help", }
                    )
                ]
            });
            msg.guild.members.cache.find(m => m.id === obj.id).send({
                embeds: [
                    buildEmbed(
                        "#da1212",
                        "Auto-Mute",
                        "You have been automatically Muted for hitting 3 warnings",
                        [
                            { name: "Warning 1", value: obj.messages[0].substring(0, obj.messages[0].indexOf('xOvermod_split')) + ' - ' + obj.messages[0].substring(obj.messages[0].indexOf('xOvermod_split') + 14) },
                            { name: "Warning 2", value: obj.messages[1].substring(0, obj.messages[1].indexOf('xOvermod_split')) + ' - ' + obj.messages[1].substring(obj.messages[1].indexOf('xOvermod_split') + 14) },
                            { name: "Warning 3", value: obj.messages[2].substring(0, obj.messages[2].indexOf('xOvermod_split')) + ' - ' + obj.messages[2].substring(obj.messages[2].indexOf('xOvermod_split') + 14) },
                        ],
                        { text: "Message Isaac.#0005 for help", }
                    )
                ]
            }).catch((err) => {
                console.log(err);
                return;
            })

            mutedUsers.push(obj.id);

            setTimeout(() => {
                try {
                    msg.guild.members.cache.find(m => m.id === obj.id).roles.remove('989021549438861322');
                } catch {
                    return;
                }
            }, 360000)
        } else if (obj.messages.length == 1) {
            msg.guild.members.cache.find(m => m.id === obj.id).send({
                text: 'You have received a warning. Once you receive three warnings, you will be automatically muted for an hour. On your fourth warning, you will be automatically banned from the server.',
                embeds: [
                    buildEmbed(
                        "#E49700",
                        "Warning",
                        "You have received a warning. Your third warning will result in an hour-long mute, and your fourth warning will result in a ban",
                        [
                            { name: "Warning Message", value: obj.messages[0].substring(obj.messages[0].indexOf('xOvermod_split') + 14) },
                            { name: "Moderator", value: obj.messages[0].substring(0, obj.messages[0].indexOf('xOvermod_split')) },
                        ],
                        { text: "Message Isaac.#0005 for help", }
                    )
                ]
            }).catch((err) => {
                return;
            })
        } else if (obj.messages.length == 4) {
            msg.guild.members.cache.find(m => m.id === obj.id).send({
                embeds: [
                    buildEmbed(
                        "#da1212",
                        "Auto-Ban",
                        "You have been automatically banned for hitting 4 warnings",
                        [
                            { name: "Warning 1", value: obj.messages[0].substring(0, obj.messages[0].indexOf('xOvermod_split')) + ' - ' + obj.messages[0].substring(obj.messages[0].indexOf('xOvermod_split') + 14) },
                            { name: "Warning 2", value: obj.messages[1].substring(0, obj.messages[1].indexOf('xOvermod_split')) + ' - ' + obj.messages[1].substring(obj.messages[1].indexOf('xOvermod_split') + 14) },
                            { name: "Warning 3", value: obj.messages[2].substring(0, obj.messages[2].indexOf('xOvermod_split')) + ' - ' + obj.messages[2].substring(obj.messages[2].indexOf('xOvermod_split') + 14) },
                            { name: "Warning 4", value: obj.messages[3].substring(0, obj.messages[3].indexOf('xOvermod_split')) + ' - ' + obj.messages[3].substring(obj.messages[3].indexOf('xOvermod_split') + 14) },
                        ],
                        { text: "Message Isaac.#0005 for help", }
                    )
                ]
            }).catch(() => {
                return;
            })
            let reason = "4 Warnings";
            msg.guild.channels.cache.find(c => c.name === "logs").send({
                embeds: [
                    buildEmbed(
                        "#da1212",
                        "Event: Auto-Ban",
                        `${user} banned`,
                        [
                            { name: "Reason", value: reason },
                            { name: "Moderator", value: "xOvermod#3621" }
                        ],
                        { text: "xOvermod by Isaac Maddox. ,help", }
                    )
                ]
            }).catch(() => {
                return;
            })
            setTimeout(() => {
                msg.guild.members.cache.find(m => m.id === obj.id).ban({ reason }).catch(() => {
                    return;
                })
            }, 500);
        }
    });
}

function appeal(msg) {
    msg.guild.channels.create(`${msg.author.tag}-appeal`, {
        type: "text",
        permissionOverwrites: [
            {
                id: msg.guild.roles.everyone,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: msg.author.id,
                deny: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
            }
        ]
    }).then((channel) => {
        channel.setParent('989027542428184666');
        channel.send(`${msg.author}, please explain your issue here. A <@&989022886801072169> member will be with you shortly. We recommend sending screenshots of the incident you are appealing.`);
    });
}

function closeappeal(msg) {
    msg.channel.send('Closing channel...');
    setTimeout(() => {
        msg.channel.delete();
    }, 1000);
}

function buildEmbed(color, title, description, fields, footer) {
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
        .setTimestamp();

    return embed;
}

function report(msg) {
    msg.guild.channels.create(`${msg.author.tag}-report`, {
        type: "text",
        permissionOverwrites: [
            {
                id: msg.guild.roles.everyone,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                id: msg.author.id,
                deny: [Permissions.FLAGS.CREATE_INSTANT_INVITE],
                allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
            }
        ]
    }).then((channel) => {
        channel.setParent('989027542428184666');
        channel.send(`${msg.author}, please tell us what you wish to report. A <@&989022886801072169> member will be with you shortly.`);
    });
}

function User(id) {
    this.id = id;
    this.messages = [];
}

// Login to Discord with your client's token
client.login(token);
