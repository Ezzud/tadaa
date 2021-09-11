'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db')
module.exports = async (client, guild) => {
    if(!guild.name || guild.name === "undefined"|| guild.name === undefined) return;
    var data = new db.table("serverInfo")
    await data.delete(`${guild.id}`)
    await fs.appendFileSync(`./logs/guildRemove/latest.log`, `- [-] Retiré sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8",{'flags': 'a+'});
    let channel = client.guilds.cache.get('656744068134469633')
    if(!channel) return;
    channel = channel.channels.cache.get('761338977713389609')
    if(!channel) return;
    var owner = guild.owner;
    let embed = new Discord.MessageEmbed()
    .setTitle(`Suppression dans le shard ${client.shard.ids[0]}`)
    .setColor('#FF5233')
    .setThumbnail(guild.iconURL())
    .addField(`ℹ Informations sur le serveur`, `Nom: \`${guild.name}\`\nID: \`${guild.id}\`\nPropriétaire: ${guild.owner} (${owner.user.tag})\nNombre de membres: **${guild.memberCount}**`)
    .setTimestamp()
    channel.send(embed)
    return console.log(`- [-] Retiré de ${guild.name}`);
}