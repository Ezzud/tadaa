'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db')

module.exports = async (client, guild) => {
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
    let channel = client.guilds.cache.get('656744068134469633').channels.cache.get('761338977713389609')
    if(!channel) return;
    var owner = guild.owner;
    try {
    	owner = await guild.members.fetch(guild.ownerID)
    } catch(err) {
    	console.error(err)
    }
    let embed = new Discord.MessageEmbed()
    .setTitle(`Ajout dans le shard ${client.shard.ids[0]}`)
    .setColor('#42FF33')
    .setThumbnail(guild.iconURL())
    .addField(`ℹ Informations sur le serveur`, `Nom: \`${guild.name}\`\nID: \`${guild.id}\`\nPropriétaire: ${guild.owner} (${owner.user.tag})\nNombre de membres: **${guild.memberCount}**`)
    .setTimestamp()
    channel.send(embed)
    return console.log(`- [+] Ajouté sur ${guild.name}`);
}