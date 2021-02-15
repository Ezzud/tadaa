'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = require('quick.db')
module.exports = async (client, guild) => {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${guild.id}.json`);
    var database = low(adapting);
    var data = new db.table("serverInfo")
    await data.delete(`${message.guild.id}`)
    await fs.appendFileSync(`./logs/guildRemove/latest.log`, `- [-] Retiré sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8",{'flags': 'a+'});
    return console.log(`- [-] Retiré de ${guild.name}`);
}