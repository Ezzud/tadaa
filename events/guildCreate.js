'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db')
const config = require('../config.json')

module.exports = async (client, guild) => {
    var data = new db.table("serverInfo")
    await data.set(`${guild.id}.creation`, `off`)
    await data.set(`${guild.id}.prefix`, config.prefix)
    await data.set(`${guild.id}.isDMWin`, true)
    await data.set(`${guild.id}.rainbow`, false)
    await fs.appendFileSync(`./logs/guildCreate/latest.log`, `- [+] Ajouté sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8",{'flags': 'a+'});
    let guildID = '656744068134469633'
    let channelID = '761338977713389609'
    var owner = guild.owner;
    try {
        owner = await guild.members.fetch(guild.ownerID)
    } catch(err) {
        console.error(err)
    }
    await client.shard.broadcastEval(`    
                    (async () => {
                        const Discord = require('discord.js');
                        let guild = this.guilds.cache.get('${guildID}');
                        if (guild) {
                            let channel = guild.channels.cache.get('${channelID}')
                            if(channel) {
                            let embed = new Discord.MessageEmbed()
                            .setTitle("Ajout dans le shard ${client.shard.ids[0]}")
                            .setColor('#49ff33')
                            .setThumbnail("${guild.iconURL()}")
                            .addField(":newspaper: Nom", "**${guild.name}**", false)
                            .addField(":id: ID", "${guild.id}", true)
                            .addField(":man_detective: Propriétaire", "${guild.owner} (${owner.user.tag})", false)
                            .addField(":busts_in_silhouette: Membres", "**${guild.memberCount}**", true)
                            .setTimestamp()
                            channel.send(embed)
                            }
                        }
                            
                        return undefined;
                    })();
                `);
    return console.log(`- [+] Ajouté sur ${guild.name}`);
}