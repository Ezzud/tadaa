'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
module.exports.run = async (client, pf, message, args, manager,json,lang) => {
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 1); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    if (message.guild.member(message.author).hasPermission(32) === false) {
        let role = message.guild.member(message.author).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    let embed;
    if (!message.guild.member(client.user).hasPermission(19456)) return (message.channel.send(permembed));
    if (!args[0]) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startSyntax.split("%nope%").join(client.nope).split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    let channel = message.mentions.channels.first()
    if (!channel) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    if (channel.type !== 'text') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoTextChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    let duration = args[1]
    if (!duration) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    let timems = ms(duration)
    if (!timems) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startDurationError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    } else {
        duration = duration.replace(/-/g, '')
    }
    let winners = args[2]
    if (!winners) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoWinners.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    winners = winners.replace(/-/g, '')
    winners = parseInt(winners)
    winners = winners.toString()
    if (winners === 'NaN') {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startWinnersError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    } else {
        winners = parseInt(winners)
        winners = Math.trunc(winners);
    }
    let prize = message.content.replace(`${pf}start`, '')
    prize = prize.replace(args[0], '')
    prize = prize.replace(args[1], '')
    prize = prize.replace(args[2], '')
    prize = prize.replace('    ', '')
    if (!args[3]) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoPrize.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    if (prize.lenght > 100) {
        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startPrizeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        return (message.channel.send(embed));
    }
    manager.start(channel, {
        time: ms(duration),
        IsRequiredRole: false,
        requiredRole: null,
        prize: prize,
        winnerCount: parseInt(winners),
        IsRequiredServer: false,
        requiredServer: null,
        lang: "fr_FR",
        langfile: lang,
        requiredServerName: null
    }).then((gData) => {
    	console.log(gData.lang)
        console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
        let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startEmbedSuccess.split("%okay%").join(client.okay).split("%channel%").join(`<#${gData.channelID}>`)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(yembed)
    }).catch((err) => {
        message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(noembed)
    });
}
module.exports.help = {
    name: "start"
}