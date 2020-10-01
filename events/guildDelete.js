'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
module.exports = async (client, guild) => {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${guild.id}.json`);
    var database = low(adapting);
    await database.unset(`data`).write()
    return console.log(`- [-] Retiré de ${guild.name}`);
}