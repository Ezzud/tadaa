'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
module.exports = async (client, guild) => {
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${guild.id}.json`);
    var database = low(adapting);
    await database.set(`data.channel`, `Erreur!`).write()
    await database.set(`data.time`, `Erreur!`).write()
    await database.set(`data.winnerstr`, `Erreur!`).write()
    await database.set(`data.price`, `Erreur!`).write()
    await database.set(`data.creation`, `off`).write()
    await database.set(`data.prefix`, `t!`).write()
    await database.set(`data.isrequiredrole`, 'Erreur!').write()
    await database.set(`data.requiredrole`, 'Erreur!').write()
    await database.set(`data.isDMWin`, true).write()
    return console.log(`- [+] Ajouté sur ${guild.name}`);
}