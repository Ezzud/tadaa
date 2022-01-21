'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
const request = require("request")
const Topgg = require(`@top-gg/sdk`)
const config = require('../config.json')
var api;
if (config.topggEnabled === true) {
    api = new Topgg.Api(config.topggToken)
}
const db = require('quick.db')
module.exports.run = async(client, pf, message, args, manager, json, lang) => {
    console.log = function(d) {
        let date = new Date();
        date.setHours(date.getHours() + 1); //
        fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8", {
            'flags': 'a+'
        });
        log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
    };
    if (message.guild.members.cache.get(message.author.id).permissions.has(32) === false) {
        let role = message.guild.members.cache.get(message.author.id).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [embed] })
            return;
        }
    }
    const data = new db.table("serverInfo")
    let giveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    giveaways = giveaways.filter((g) => g.ended !== true);
    if (config.topggEnabled === true) {
        if (await api.hasVoted(message.author.id) === false) {
            if (giveaways.length >= 10) {
                let tmEmbed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.NoVotedGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send({ embeds: [tmEmbed] }));
            }
        } else {
            if (giveaways.length >= 20) {
                let tm2Embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.TooMuchGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send({ embeds: [tm2Embed] }));
            }
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    let embed;
    if (!message.guild.members.cache.get(client.user.id).permissions.has(379968)) return (message.channel.send(permembed));
    if (!args[0]) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startSyntax.split("%nope%").join(client.nope).split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    let channel = message.mentions.channels.first()
    if (!channel) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    if (channel.type !== 'GUILD_TEXT' && channel.type !== 'GUILD_NEWS' && channel.type !== 'GUILD_STORE' && channel.type !== 'GUILD_PUBLIC_THREAD' && channel.type !== 'GUILD_PRIVATE_THREAD') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoTextChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    let duration = args[1]
    if (!duration) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    let timems = ms(duration)
    if (!timems) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startDurationError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    } else {
        if (timems > 5184000000) {
            embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startTooLargeDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return (message.channel.send({ embeds: [embed] }));
        } else if (timems > 596160000) {
            if (await api.hasVoted(message.author.id) === false) {
                embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoVoted.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send({ embeds: [embed] }));
            }
        }
        duration = duration.replace(/-/g, '')
    }
    let winners = args[2]
    if (!winners) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoWinners.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    winners = winners.replace(/-/g, '')
    winners = parseInt(winners)
    winners = winners.toString()
    if (winners === 'NaN') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startWinnersError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    } else {
        winners = parseInt(winners)
        winners = Math.trunc(winners);
    }
    let prize = message.content.replace(`${pf}start`, '')
    prize = prize.replace(args[0], '')
    prize = prize.replace(args[1], '')
    prize = prize.replace(args[2], '')
    prize = prize.replace('    ', '')
    prize = prize.split("-role")[0].split("-guild")[0]
    if (!args[3]) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoPrize.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    if (prize.length > 50) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startPrizeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send({ embeds: [embed] }));
    }
    if (!await data.get(`${message.guild.id}.rainbow`)) {
        await data.set(`${message.guild.id}.rainbow`, false)
    }
    var isrequiredrole = false;
    var requiredrole = null;
    var isrequiredserver = false;
    var requiredserver = null;
    var requiredservername = null;
    var requiredserverinvite = null;
    var error = false;
    var i = 0;
    for (i in args) {
        if (error === true) continue;
        if (args[i] === "-role") {
            let number = parseInt(i)
            number += 1
            if (!args[number]) {
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startRoleNoArg.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [noembed] })
                error = true
                i++
                continue;
            } else {
                var role = args[number]
                role = role.replace('<', '').replace('>', '').replace('@&', '').replace(' ', '')
                role = message.guild.roles.cache.get(role)
                if (!role) {
                    let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [noembed] })
                    error = true
                    i++
                    continue;
                } else {
                    isrequiredrole = true;
                    requiredrole = role.id;
                    i++
                    continue;
                }
            }
        }
        if (args[i] === "-guild") {
            if (error === true) continue;
            let number = parseInt(i)
            number += 1
            if (!args[number]) {
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startServerNoArg.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [noembed] })
                error = true
                i++
                continue;
            } else {
                var guild = await client.shard.broadcastEval((cl, context) => {
                    let guild = cl.guilds.cache.get(context.guildID);
                    if (!guild) {
                        return undefined;
                    }
                    return guild;
                }, { context: { "guildID": args[number] } })
                var completeList = []
                for (let i = 0; i < guild.length; i++) {
                    if (guild[i]) {
                        completeList.push(guild[i])
                    }
                }
                let rightServer = completeList.find(x => x.id === args[number])
                if (rightServer) {
                    /*if (!guild.member(client.user).permissions.has("CREATE_INSTANT_INVITE")) {
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerInviteError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send({ embeds: [embed]})
                        i++
                        continue;
                    }
                    */
                    let invite = await client.shard.broadcastEval(async(cl, context) => {
                        let guild = cl.guilds.cache.get(context.guildID);
                        if (!guild) {
                            return undefined;
                        }
                        var chx = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);
                        if (!chx) {
                            return undefined;
                        }
                        let invite = await chx.createInvite({
                            temporary: false,
                            maxAge: 0
                        })

                        return invite.url;
                    }, { context: { "guildID": args[number] } })
                    invite = invite.toString().replace(",", "")
                    isrequiredserver = true;
                    requiredserver = rightServer.id;
                    requiredservername = rightServer.name;
                    requiredserverinvite = invite;
                    i++
                    continue;
                } else {
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    error = true;
                    i++
                    continue;
                }
            }

        }
    }
    if (error === true) return;
    manager.start(channel, {
        time: ms(duration),
        IsRequiredRole: isrequiredrole,
        requiredRole: requiredrole,
        prize: prize,
        winnerCount: parseInt(winners),
        IsRequiredServer: isrequiredserver,
        requiredServer: requiredserver,
        lang: lang.id,
        shardID: client.shard.ids[0],
        langfile: lang,
        hostedBy: message.author.id,
        rainbow: await data.get(`${message.guild.id}.rainbow`) || false,
        requiredServerName: requiredservername,
        requiredServerInvite: requiredserverinvite
    }).then((gData) => {
        console.log(`Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
        let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startEmbedSuccess.split("%okay%").join(client.okay).split("%channel%").join(`<#${gData.channelID}>`)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send({ embeds: [yembed] })
    }).catch((err) => {
        message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send({ embeds: [noembed] })
    });
}
module.exports.help = {
    name: "start"
}