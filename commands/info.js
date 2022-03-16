'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const Topgg = require(`@top-gg/sdk`)
const config = require('../config.json')
const QuickChart = require('quickchart-js');
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
module.exports.run = async(client, pf, message, manager, json, lang) => {
        var messagePing = new Date().getTime() - message.createdTimestamp
        var apiPing = Math.trunc(client.ws.ping)
        await message.deferReply()
        let count3 = 0;
        let values3 = await client.shard.fetchClientValues('shard.ids[0]');
        values3.forEach((value) => {
            count3 = count3 + 1
        });
        let remainingTime = new Date(client.uptime)
        let roundTowardsZero = remainingTime > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(remainingTime / 86400000),
            hours = roundTowardsZero(remainingTime / 3600000) % 24,
            minutes = roundTowardsZero(remainingTime / 60000) % 60,
            seconds = roundTowardsZero(remainingTime / 1000) % 60;
        let d, h, m, s;
        if (days > 0) {
            d = `${days} ${lang.infoDays}`
        } else if (days === 0) {
            d = ``
        } else if (days === 1) {
            d = `${days} ${lang.infoDay}`
        } else {
            d = ``
        }
        if (hours > 0) {
            h = `${hours} ${lang.infoHours}`
        } else if (hours === 0) {
            h = ``
        } else if (hours === 1) {
            h = `${hours} ${lang.infoHour}`
        } else {
            h = ``
        }
        if (minutes > 0) {
            m = `${minutes} ${lang.infoMinutes}`
        } else if (minutes === 0) {
            m = ``
        } else if (minutes === 1) {
            m = `${minutes} ${lang.infoMinute}`
        } else {
            m = ``
        }
        if (seconds > 0) {
            s = `${seconds} ${lang.infoSeconds}`
        } else if (seconds === 0) {
            s = ``
        } else if (seconds === 1) {
            s = `${seconds} ${lang.infoSecond}`
        } else {
            s = ``
        }
        let msg = `${d || " "} ${h || " "} ${m || " "} ${s || " "}`
        let req = await client.shard.fetchClientValues('guilds.cache.size');
        req = req.reduce((p, n) => p + n, 0);
        var memory = process.memoryUsage()
        let votes;
        if (config.topggEnabled === true) {
            votes = await api.getVotes()
        }

        const pingChart = new QuickChart();
        await pingChart.setConfig({
            type: 'bar',
            data: { labels: ['1m ago', "45s ago", "30s ago", '15s ago', 'Now'], datasets: [{ label: 'Average API ping', data: client.pinglist }] },
        });
        pingChart.setWidth(400).setHeight(200).setBackgroundColor('transparent');


        var chart = await pingChart.getShortUrl();

        var embed = new Discord.MessageEmbed()
            .setTitle(lang.infoTitle)
            .setColor('#F5E351')
            //.setThumbnail(client.user.avatarURL())
            .addField(lang.infoPingTitle.split("%loading%").join(loadings), `${lang.infoPingField.split("%messagePing%").join(messagePing).split("%apiPing%").join(apiPing)}`, false)
            .addField(lang.infoChangelogTitle, `${lang.infoChangelogField.split("%version%").join(json.version).split("%changelogs%").join(`[Github](https://github.com/Ezzud/tadaa) - [Website](https://ezzud.fr)`)}`, true)
            .addField(lang.infoShardsTitle.split("%shard%").join(getEmoji("sharding")), `${lang.infoShardsField.split("%activeShards%").join(count3).split("%maxShards%").join(client.shard.count).split("%shard%").join(client.shard.ids[0])}`, true)
            .addField(lang.infoDevTitle.split("%dev%").join(getEmoji("dev")), `${lang.infoDevField}`, false)
            .addField(lang.infoUptimeTitle.split("%uptime%").join(getEmoji("computer")), `${lang.infoUptimeField.split("%uptime%").join(msg)}`, false);
        if (config.topggEnabled === true) {
            embed.addField(lang.infoVotesTitle.split("%vote%").join(":inbox_tray:"), `${lang.infoVotesField.split("%votes%").join(votes.length)}`, true);
        }
        embed.addField(lang.infoMemoryTitle.split("%memory%").join(getEmoji("memoire")), `${lang.infoMemoryField.split("%memory%").join(bts(memory.heapUsed))}`, true)
        .addField(lang.infoServersTitle, `${lang.infoServersField.split("%servers%").join(req)}`, true)
        .setImage(chart)
        .setFooter(lang.footer.split("%version%").join(json.version), message.user.avatarURL());

    let buttonArray = []
    let websiteButton = new Discord.MessageButton().setLabel("Upvote").setStyle("LINK").setURL("https://top.gg/bot/732003715426287676").toJSON()
    let inviteButton = new Discord.MessageButton().setLabel("Invite").setStyle("LINK").setURL("https://discord.com/api/oauth2/authorize?client_id=732003715426287676&permissions=414733167713&scope=bot%20applications.commands").toJSON()
    let supportButton = new Discord.MessageButton().setLabel("Support").setStyle("LINK").setURL("https://discord.gg/ezzud").toJSON()

    buttonArray.push(inviteButton);
    buttonArray.push(websiteButton);
    buttonArray.push(supportButton);
    let buttons = new Discord.MessageActionRow().addComponents(buttonArray).toJSON()

    message.editReply({ components: [buttons], embeds: [embed] });

}
module.exports.help = {
    name: "info"
}