'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db')
const request = require("request")

module.exports = async(client, guild) => {

    var data = new db.table("serverInfo")
    await data.delete(`${guild.id}`)
    await fs.appendFileSync(`./logs/guildRemove/latest.log`, `- [-] Retiré sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8", { 'flags': 'a+' });

    let embed = new Discord.MessageEmbed()
        .setTitle(`Suppression dans le shard ${client.shard.ids[0]}`)
        .setColor('#FF5233')
        .setThumbnail(guild.iconURL() || "https://cdn.discordapp.com/avatars/732003715426287676/492801b4c8e9c1fe72f97d8cc609b147.png?size=4096")
        .addField(":newspaper: Nom", `**${guild.name}**`, false)
        .addField(":id: ID", `${guild.id}`, true)
        .addField(":man_detective: Propriétaire", `<@${guild.ownerId}>`, false)
        .addField(":busts_in_silhouette: Membres", `**${guild.memberCount}**`, true)
        .setTimestamp()

    var myJSONObject = {
        "username": "TADAA v1.5.0",
        "avatar_url": "https://cdn.discordapp.com/avatars/732003715426287676/492801b4c8e9c1fe72f97d8cc609b147.png?size=4096",
        "embeds": [embed.toJSON()]
    };
    request({
        url: "https://discord.com/api/webhooks/941641580085927946/EwhOVvCtR07hbR6J-HgG9VpipDUgSbh1QQRsYFmjZp56NsMQDZnOJ6sV8L8rrUDrupgF",
        method: "POST",
        json: true,
        body: myJSONObject
    }, function(error, response, body) {});

    return console.log(`- [-] Retiré de ${guild.name}`);
}