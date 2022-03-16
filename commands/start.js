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
module.exports.run = async(client, pf, message, manager, json, lang) => {
    console.log = function(d) {
        let date = new Date();
        date.setHours(date.getHours() + 1); //
        fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8", {
            'flags': 'a+'
        });
        log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
    };
    if (message.guild.members.cache.get(message.user.id).permissions.has("MANAGE_GUILD") === false) {
        let role = message.guild.members.cache.get(message.user.id).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.reply({ embeds: [embed], ephemeral:true })
            return;
        }
    }
    let giveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    giveaways = giveaways.filter((g) => g.ended !== true);
    if (config.topggEnabled === true) {
        if (await api.hasVoted(message.user.id) === false) {
            if (giveaways.length >= 10) {
                let tmEmbed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.NoVotedGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.reply({ embeds: [tmEmbed] }));
            }
        } else {
            if (giveaways.length >= 20) {
                let tm2Embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.TooMuchGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.reply({ embeds: [tm2Embed] }));
            }
        }
    }

    async function run() {
        let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version));

    let embed;
    let channel = message.options.getChannel("channel")
    if (!channel) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    }
    if (channel.type !== 'GUILD_TEXT' && channel.type !== 'GUILD_NEWS' && channel.type !== 'GUILD_STORE' && channel.type !== 'GUILD_PUBLIC_THREAD' && channel.type !== 'GUILD_PRIVATE_THREAD') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoTextChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    }
    let duration = message.options.getString("duration")
    if (!duration) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    }
    let timems = ms(duration)
    if (!timems) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startDurationError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    } else {
        if (timems > 5184000000) {
            embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startTooLargeDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return (message.reply({ embeds: [embed] }));
        } else if (timems > 596160000) {
            if (await api.hasVoted(message.user.id) === false) {
                embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoVoted.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.reply({ embeds: [embed] }));
            }
        }
        duration = duration.replace(/-/g, '')
    }
    let winners = message.options.getInteger("winners")
    if (!winners) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoWinners.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    }
    winners = winners.toString().replace(/-/g, '')
    winners = parseInt(winners)
    winners = winners.toString()
    if (winners === 'NaN') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startWinnersError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    } else {
        winners = parseInt(winners)
        winners = Math.trunc(winners);
    }
    let prize = message.options.getString("prize")
    if (prize.length > 50) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startPrizeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.reply({ embeds: [embed] }));
    }
    let data = new db.table("serverInfo")


    if (!data.get(`${message.guild.id}.rainbow`)) {
        data.set(`${message.guild.id}.rainbow`, false)
    }
    var isrequiredrole = false;
    var requiredrole = null;
    var isrequiredserver = false;
    var requiredserver = null;
    var requiredservername = null;
    var requiredserverinvite = null;
    var error = false;
    var i = 0;
        if (message.options.getRole("required_role")) {
                var role = message.options.getRole("required_role")
                if (!role) {
                    let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.reply({ embeds: [noembed] })
                    error = true
                    return;
                } else {
                    isrequiredrole = true;
                    requiredrole = role.id;
                }
            }
        if (message.options.getString("required_server")) {
            if (!message.options.getString("required_server")) {
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startServerNoArg.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.reply({ embeds: [noembed] })
                error = true
                return;
            } else {
                
                let guild = await checkGuild(client, message.options.getString("required_server"))
                var completeList = []
                for (let i = 0; i < guild.length; i++) {
                    if (guild[i]) {
                        completeList.push(guild[i])
                    }
                }
                let rightServer = await completeList.find(x => x.id === message.options.getString("required_server"))
                if (rightServer) {       
                    let invite = await createInvite(client, message.options.getString("required_server"))
                    invite = invite.toString().replace(",", "")



                    isrequiredserver = true;
                    requiredserver = rightServer.id;
                    requiredservername = rightServer.name;
                    requiredserverinvite = invite;
                } else {
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.reply({ embeds: [embed] })
                    error = true;
                    return;
                }
                
                
            }

        }
    if (error === true) return;
    let rainbowMode = await data.get(`${message.guild.id}.rainbow`)
    const stats = new db.table("stats")

    if (!await stats.get("creation_count")) {
        await stats.set("creation_count", 0)
    }
    await stats.add(`creation_count`, 1)
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
        hostedBy: message.user.id,
        rainbow: rainbowMode || false,
        requiredServerName: requiredservername,
        requiredServerInvite: requiredserverinvite
    }).then((gData) => {
        console.log(`Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
        let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startEmbedSuccess.split("%okay%").join(client.okay).split("%channel%").join(`<#${gData.channelID}>`)).setFooter(lang.footer.split("%version%").join(json.version))
        message.reply({ embeds: [yembed] })
    }).catch((err) => {
        message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.reply({ embeds: [noembed] })
    });

}
run()




}
module.exports.help = {
    name: "start"
}






async function checkGuild(client, guildID) {
    var guild = await client.shard.broadcastEval((cl, context) => {
        let guild = cl.guilds.cache.get(context.guildID);
        if (!guild) {
            return undefined;
        }
        return guild;
    }, { context: { "guildID": guildID } })
    return guild;                 
}

async function createInvite(client, guildID) {
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
    }, { context: { "guildID": guildID } })
    return invite;
}