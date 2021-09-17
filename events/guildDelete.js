'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db')
module.exports = async (client, guild) => {
    if(!guild.name || guild.name === "undefined"|| guild.name === undefined) return;
    var data = new db.table("serverInfo")
    await data.delete(`${guild.id}`)
    await fs.appendFileSync(`./logs/guildRemove/latest.log`, `- [-] Retiré sur ${guild.name}::${guild.memberCount}::${guild.id} \n`, "UTF-8",{'flags': 'a+'});
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
                            .setTitle("Suppression dans le shard ${client.shard.ids[0]}")
                            .setColor('#FF5233')
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
    return console.log(`- [-] Retiré de ${guild.name}`);
}