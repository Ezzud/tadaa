'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const config = require('../config.json')
const moment = require('moment')



module.exports.run = async (client, pf, message, manager, json, lang) => {
    var guild_to_get = await client.shard.broadcastEval(async (cl, context) => {
        let guild = cl.guilds.cache.get(context.guildID);
                if (!guild) {
                    return undefined;
                }
                    
                return guild;
    }, { context: { "guildID": config.guildID } })
    var completeGuildList = []
    for (let i = 0; i < guild_to_get.length; i++) {
        if (guild_to_get[i]) {
            completeGuildList.push(guild_to_get[i])
        }
    }
    let rightServer = completeGuildList.find(x => x.id === config.guildID)


    var embed = new Discord.MessageEmbed()
    .setAuthor(client.user.username, client.user.avatarURL())
    .setThumbnail(rightServer.iconURL)
    .setDescription(`**[Join support server here](https://discord.gg/ezzud)**\n-  **French** :flag_fr: and **English** :flag_gb: Support\n- **${rightServer.memberCount}** members\n`)
    .setColor("#33E3FF")
    .setTimestamp()
    message.reply({embeds:[embed]})

}


module.exports.help = {
    name: "support"
}