'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const settings = require('../config.json')
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
    warn: "732581316217929782"
};
const loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
module.exports.run = async (client, pf, message, args, nope, info, okay, what, warning, manager) => {
    if (message.author.id === settings.ownerID) {
        let emoji = loadings;
        let reloadEmbed = new Discord.MessageEmbed().setColor('D7E921').setDescription(`\u200B`).setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`\n\u200BEtat`, `${emoji} Redémarrage du shard \` ${client.shard.ids[0]} \` en cours\n\u200B`).setFooter(`TADAA | créé par ezzud`)
        await message.channel.send(reloadEmbed);
        let dater = new Date().getTime();
        await client.destroy()
        await client.login(settings.token)
        let datef = new Date().getTime();
        let time = datef - dater;
        time = time / 1000
        let count = 0;
        let values = await client.shard.broadcastEval(`
                  [
                    this.shard.id,
                    this.guilds.cache.size
                  ]
                `);
        values.forEach((value) => {
            count = count + 1
        });
        let reloadedEmbed = new Discord.MessageEmbed().setColor('5BCA2F').setDescription(`\u200B`).setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(`\n\u200BEtat`, `${okay} Redémarrage du shard \` ${client.shard.ids[0]} \` effectué (*${time}s*)`).addField(`Shards`, `\`${count}\`/\`${client.shard.count}\`\n\u200B`).setFooter(`TADAA | créé par ezzud`)
        await message.channel.send(reloadedEmbed)
    }
}
module.exports.help = {
    name: "reload"
}