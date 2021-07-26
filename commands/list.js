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
    date.setHours(date.getHours() + 2); //
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
    if (!message.guild.member(client.user).hasPermission(379968)) return (message.channel.send(permembed));
    let onServer;
    onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    onServer = onServer.filter((g) => g.ended !== true);
    let onServer2;
    let onServer3;
    let onServer4;
    if (!onServer) {
        onServer = 'Aucun :('
    } else {
        onServer = onServer.map(g => `${lang.listGiveawaysMap.split("%prize%").join(g.prize).split("%endDate%").join(`${moment(new Date(g.endAt).setHours(new Date(g.endAt).getHours() + 1)).format('L')} ${moment(new Date(g.endAt).setHours(new Date(g.endAt).getHours() + 1)).format('LT')}`).split("%endAt%").join(moment(g.endAt).fromNow())} [${lang.listGiveawaysAccessButton}](https://discordapp.com/channels/${g.guildID}/${g.channelID}/${g.messageID})::`)
        onServer = Array.from(onServer)
        if (onServer[6] !== undefined && onServer[10] !== undefined) {
            onServer2 = onServer.slice(6, 10)
            onServer2 = onServer2.toString().replace(/::/g, `\n`).replace(/,/g, ``)
        } else {
            onServer2 = `\u200B`;
        }
        if (onServer[11] !== undefined && onServer[15] !== undefined) {
            onServer3 = onServer.slice(11, 15)
            onServer3 = onServer3.toString().replace(/::/g, `\n`).replace(/,/g, ``)
        } else {
            onServer3 = `\u200B`;
        }
        if (onServer[16] !== undefined && onServer[20] !== undefined) {
            onServer4 = onServer.slice(16, 20)
            onServer4 = onServer4.toString().replace(/::/g, `\n`).replace(/,/g, ``)
        } else {
            onServer4 = `\u200B`;
        }
        onServer = onServer.slice(0, 5)
        onServer = onServer.toString().replace(/::/g, `\n`).replace(/,/g, ``)
    }
    if (onServer.lenght > 1000) {
        onServer = 'Aucun :('
    }
    if (onServer2.lenght > 1000) {
        onServer2 = `\u200B`
    }
    if (onServer3.lenght > 1000) {
        onServer3 = `\u200B`
    }
    if (onServer4.lenght > 1000) {
        onServer4 = `\u200B`
    }
    var embed = new Discord.MessageEmbed()
    .setAuthor(lang.listEmbedTitle)
    .setThumbnail(client.user.avatarURL())
    .setColor(`#F79430`)
    .addField(`\u200B`, onServer || lang.listEmbedNoGiveaway)
    .addField(`\u200B`, `${onServer2 || `\u200B`}`)
    .addField(`\u200B`, `${onServer3 || `\u200B`}`)
    .addField(`\u200B`, `${onServer4 || `\u200B`}\n\n\u200B`)
    .addField(lang.listEmbedInfoTitle, lang.listEmbedInfoField)
    .setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL())
    .setTimestamp()
    message.channel.send(embed)
}
module.exports.help = {
    name: "list"
}