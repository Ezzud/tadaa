'use strict';
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

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
const Discord = require("discord.js");
const ms = require('ms');
const fs = require('fs');
const config = require('../config.json')

module.exports.run = async(client, pf, message, args, manager, json, lang) => {
    let guildSize = await client.shard.fetchClientValues('guilds.cache.size');
    let guildTotal = guildSize.reduce((p, n) => p + n, 0);
    let values = await client.shard.fetchClientValues('shard.ids[0]');
    values = values.length
    let embed = new Discord.MessageEmbed()
        .setAuthor(`Shards`, client.user.avatarURL(), "https://github.com/Ezzud/tadaa")
        .setDescription(`${getEmoji("sharding")} Shard ID #${client.shard.ids[0]}`)
        .setFooter(lang.footer.split("%version%").join(json.version))
        .setThumbnail(message.guild.iconURL())
        .setColor("#337dff")
        .addField(`${client.online} Etat:`, `Active shards: \`${values}\`/\`${client.shard.count}\``);
    let i = 0
    for (i in guildSize) {
        if (guildSize[i]) {
            embed.addField(`🔹 Shard #${i}`, `**${guildSize[i]}** guilds`, true)
            i++
            continue;
        }
    }
    embed.addField(`:house: Total`, `**${guildTotal}** guilds`, false);
    message.channel.send({ embeds: [embed] })

}
module.exports.help = {
    name: "shards"
}