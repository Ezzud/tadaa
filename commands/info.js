'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
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
module.exports.run = async (client, pf, message, args, nope, info, okay, what, warning, manager, json) => {
    var timer = new Date().getTime() - message.createdTimestamp
    let uptime = (client.uptime / 1000);
    let day = Math.floor(uptime / 86400);
    let hour = Math.floor(uptime / 3600);
    uptime %= 3600;
    let minute = Math.floor(uptime / 60);
    let seconde = uptime % 60;
    seconde = Math.trunc(seconde)
    let count3 = 0;
    let values3 = await client.shard.broadcastEval(`
    [
        this.shard.id,
        this.guilds.cache.size
    ]
`);
    values3.forEach((value) => {
        count3 = count3 + 1
    });
    let daym;
    let hourm;
    let minutem;
    let secondem;
    if (day <= 1) {
        daym = 'jour'
    } else {
        daym = 'jours'
    }
    if (hour <= 1) {
        hourm = 'heure'
    } else {
        hourm = 'heures'
    }
    if (minute <= 1) {
        minutem = 'minute'
    } else {
        minutem = 'minutes'
    }
    if (seconde <= 1) {
        secondem = 'seconde'
    } else {
        secondem = 'secondes'
    }
    let req = await client.shard.fetchClientValues('guilds.cache.size');
    req = req.reduce((p, n) => p + n, 0);
    var memory = process.memoryUsage()
    var embed = new Discord.MessageEmbed().setTitle(`Informations du bot`).setColor('#e4b400').setThumbnail(client.user.avatarURL()).addField(`${loadings} Ping`, `${timer}ms\n\u200B`, true).addField(`${getEmoji("sharding")} Shards`, `\`${count3}\`/\`${client.shard.count}\` | Shard du serveur: #${client.shard.ids[0]}\n\u200B`, true).addField(`${getEmoji("computer")} Uptime`, `${day} ${daym} ${hour} ${hourm} ${minute} ${minutem} ${seconde} ${secondem}\n\u200B`, false).addField(`${getEmoji("memoire")} Utilisation de la mémoire\u200B`, `\`${bts(memory.heapUsed)}\`/\`2 GB\`\n\u200B`, false).addField(`${getEmoji("dev")} Créateur\u200B`, "ezzud#0001\n\u200B", true).addField(`:house: Nombre de serveurs`, `\` ${req} \`\n\u200B`, true).addField(`:newspaper: Changelog`, `**Version:** \`${json.version}\`\n${json.changelog}\n\u200B`, false).addField(`\u200B`, `[Support](https://discord.gg/VGt9S66) - [Inviter le bot](https://discord.com/api/oauth2/authorize?client_id=732003715426287676&permissions=355392&scope=bot)`).setFooter(`TADAA | v${json.version}`, message.author.avatarURL())
    await message.channel.send(embed)
}
module.exports.help = {
    name: "info"
}