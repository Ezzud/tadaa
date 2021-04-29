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
    await data.set(`${guild.id}.channel`, `Erreur!`)
    await data.set(`${guild.id}.time`, `Erreur!`)
    await data.set(`${guild.id}.winnerstr`, `Erreur!`)
    await data.set(`${guild.id}.price`, `Erreur!`)
    await data.set(`${guild.id}.creation`, `off`)
    await data.set(`${guild.id}.prefix`, `t!`)
    await data.set(`${guild.id}.isrequiredrole`, 'Erreur!')
    await data.set(`${guild.id}.requiredrole`, 'Erreur!')
    await data.set(`${guild.id}.isDMWin`, true)
    await data.set(`${guild.id}.rainbow`, false)
    await fs.appendFileSync(`./logs/guildCreate/latest.log`, `- [+] Ajouté sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8",{'flags': 'a+'});
    return console.log(`- [+] Ajouté sur ${guild.name}`);
}