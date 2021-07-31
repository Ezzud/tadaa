'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const Topgg = require(`@top-gg/sdk`)
const config = require('../config.json')
const db = require('quick.db')
const stats = new db.table("stats")

var api;
if (config.topggEnabled === true) {
    api = new Topgg.Api(config.topggToken)
}
let emojiMap = {
    link: "732605373185261629",
    dev: "732605373185261608",
    sharding: "732605372954575029",
    computer: "732607541061877760",
    memoire: "732698462822596659",
    okay: "732581317098602546",
    nope: "732581316880498782",
    info: "732581319971831808",
    what: "732581319678361662",
    support: "760104912372891659",
    warn: "732581316217929782"
};

function bts(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}
const loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
module.exports.run = async (client, pf, message, args, manager,json,lang) => {
        if (!await stats.get("command_count")) {
            await stats.set("command_count", 0)
        }
        let command_count = await stats.get("command_count")

        if (!await stats.get("creation_count")) {
            await stats.set("creation_count", 0)
        }
        let creation_count = await stats.get("creation_count")

        let totalGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID !== undefined).length
        let totalGiveawaysActive = client.giveawaysManager.giveaways.filter((g) => g.ended !== true).length
        let totalGiveawaysEnded = client.giveawaysManager.giveaways.filter((g) => g.ended === true).length

        let guildGiveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id).length

        

        let embed = new Discord.MessageEmbed()
        .setAuthor(lang.statsEmbedTitle, message.author.avatarURL())
        .setColor("#F18718")
        .setThumbnail(client.user.avatarURL())
        .addField(lang.statsCommandCount, ` \` ${command_count} \` `, true)
        .addField(lang.statsCreationCount, ` \` ${creation_count} \` `)
        .addField(lang.statsGiveawaysCount, ` \` ${totalGiveaways} \` (${lang.statsGiveawaysMultiple.split("%active%").join(totalGiveawaysActive).split("%ended%").join(totalGiveawaysEnded)}) `, true)
        .addField(lang.statsGiveawaysGuildCount, ` \` ${guildGiveaways} \` `)
        .setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(embed)
    }
module.exports.help = {
    name: "stats"
}