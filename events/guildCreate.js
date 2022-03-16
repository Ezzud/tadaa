'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db')
const config = require('../config.json')
const request = require("request")

module.exports = async(client, guild) => {

    var data = new db.table("serverInfo")
    await data.set(`${guild.id}.creation`, `off`)
    await data.set(`${guild.id}.prefix`, config.prefix)
    await data.set(`${guild.id}.isDMWin`, true)
    await data.set(`${guild.id}.rainbow`, false)
    await fs.appendFileSync(`./logs/guildCreate/latest.log`, `- [+] Ajouté sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8", { 'flags': 'a+' });

    var owner;
    try {
        owner = await guild.members.fetch(guild.ownerId);
    } catch (err) {
        console.error(err)
    }

    let embed = new Discord.MessageEmbed()
        .setTitle(`Ajout dans le shard ${client.shard.ids[0]}`)
        .setColor('#49ff33')
        .setThumbnail(guild.iconURL() || "https://cdn.discordapp.com/avatars/732003715426287676/492801b4c8e9c1fe72f97d8cc609b147.png?size=4096")
        .addField(":newspaper: Nom", `**${guild.name}**`, false)
        .addField(":id: ID", `${guild.id}`, true)
        .addField(":man_detective: Propriétaire", `<@${guild.ownerId}> (${owner.user.username}#${owner.user.discriminator})`, false)
        .addField(":busts_in_silhouette: Membres", `**${guild.memberCount}**`, true)
        .setTimestamp()
    var myJSONObject = {
        "username": "TADAA Logs",
        "avatar_url": "https://cdn.discordapp.com/avatars/732003715426287676/492801b4c8e9c1fe72f97d8cc609b147.png?size=4096",
        "embeds": [embed.toJSON()]
    };

    request({
        url: "https://discord.com/api/webhooks/941641580085927946/EwhOVvCtR07hbR6J-HgG9VpipDUgSbh1QQRsYFmjZp56NsMQDZnOJ6sV8L8rrUDrupgF",
        method: "POST",
        json: true,
        body: myJSONObject
    }, function(error, response, body) {});
    return console.log(`- [+] Ajouté sur ${guild.name}`);
}