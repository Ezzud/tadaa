'use strict';
const Discord = require("discord.js");
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports = async (client, messageReaction, user) => {
	if(!messageReaction) return;
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Erreur: ', error);
        }
    }
    if(!user) return;
    if (user.bot) return;
    if (messageReaction.message.channel.type === 'dm') return;
    let guild = messageReaction.message.guild
    let gw;
    gw = await client.giveawaysManager.giveaways.filter((g) => g.guildID === messageReaction.message.guild.id);
    gw = await client.giveawaysManager.giveaways.filter((g) => g.ended === false);
    if (!gw) return;
    let checkRole = false
    gw.forEach(give => {
        if (give.messageID === messageReaction.message.id) {
            checkRole = true
        } else {
            return;
        }
    })
    if (checkRole === true) {
        if (messageReaction.emoji.name !== '🎁') return;
        let gw2;
        gw2 = await client.giveawaysManager.giveaways.filter((g) => g.messageID === messageReaction.message.id);
        if (!gw2) return;
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${messageReaction.message.guild.id}.json`);
    var database = low(adapting);
        var lang = await database.get(`data.lang`).value()
        if(!lang) {
            lang = "fr_FR"
        }
        lang = require(`../lang/${lang}.json`)
        if (gw2[0].IsRequiredRole === true) {
        let role = guild.roles.cache.find(x => x.id === gw2[0].requiredRole)
        if (!role) return;

        if (guild.member(user.id).roles.cache.find(x => x.id === role.id)) {

        } else {
            try {
                await messageReaction.users.remove(user.id)
                const embed = new Discord.MessageEmbed().setAuthor(`${lang.reactError}`, 'https://cdn.discordapp.com/attachments/682274736306126925/740643196878454834/1596653488174.png').setColor('#ED3016').addField(`\u200B`, `${lang.reactNoRole.split("%rolename%").join(role.name)} \n[${lang.winButton}](https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}) ${lang.reactErrorMessage}`)
                await user.send(embed)
            } catch (error) {
                console.error(error);
            }
        
            return;
        }
    }
    if (gw2[0].IsRequiredServer === true) {
        let guild = client.guilds.cache.get(gw2[0].requiredServer)
        if(!guild) return;
        let member = await guild.members.fetch(user.id)
        if(!member) {
            try {
                await messageReaction.users.remove(user.id)
                const embed = new Discord.MessageEmbed().setAuthor(`${lang.reactError}`, 'https://cdn.discordapp.com/attachments/682274736306126925/740643196878454834/1596653488174.png').setColor('#ED3016').addField(`\u200B`, `${lang.reactNoServer.split("%requiredServerName%").join(gw2[0].requiredServerName)} \n[${lang.winButton}](https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}) ${lang.reactErrorMessage}`)
                await user.send(embed)
            } catch (error) {
                console.error(error);
            }
            
            return;     
        }
    }


    }
}