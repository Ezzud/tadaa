'use strict';
const Discord = require("discord.js");
const fs = require('fs');
const db = require("quick.db");
module.exports = async (client, messageReaction, user) => {
    if (!messageReaction) return;
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.log('Erreur lors de la récupération de la réaction: ', error);
        }
    }
    if (!user) return;
    if (user.bot) return;
    var database = new db.table("serverInfo")
    const gw_data = new db.table('giveaways')
    if (messageReaction.message.channel.type === 'dm') return;
    let guild = messageReaction.message.guild
    let gw;
    gw = await gw_data.get("giveaways").filter((g) => g.guildID === messageReaction.message.guild.id);
    gw = await gw_data.get("giveaways").filter((g) => g.ended === false);
    if (!gw) return (console.log("No Giveaway"));
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
        gw2 = await gw_data.get("giveaways").filter((g) => g.messageID === messageReaction.message.id);
        if (!gw2) return;
        var lang = await database.get(`${messageReaction.message.guild.id}.lang`)
        if (!lang) {
            lang = "fr_FR"
        }
        lang = require(`../lang/${lang}.json`)
        if (gw2[0].IsRequiredRole === true) {
            let role = guild.roles.cache.find(x => x.id === gw2[0].requiredRole)
            if (role) {
                if (guild.member(user.id).roles.cache.find(x => x.id === role.id)) {} else {
                    try {
                        await messageReaction.users.remove(user.id)
                    } catch (error) {
                        console.error(error);
                    }
                    const embed = new Discord.MessageEmbed().setAuthor(`${lang.reactError}`, 'https://ezzud.fr/images/closedFixed.png').setColor('#ED3016').setDescription(`${lang.reactNoRole.split("%rolename%").join(role.name)}`).addField(`\u200B`, `${lang.winButton.split("%link%").join(`https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)} ${lang.reactErrorMessage}`)
                    user.send(embed).catch(error => {
                        if (error.code === 50007) {
                            console.log(`Erreur: L'utilisateur n'a pas pu être DM`)
                        }
                    })
                }
            }
        }
        if (gw2[0].IsRequiredServer === true) {
            //let guild = await client.shard.broadcastEval(`this.guilds.cache.get("${gw2[0].requiredServer}")`); // WITH INTENT
            let guild = await client.guilds.fetch(gw2[0].requiredServer) // WITHOUT INTENT
            if (guild) {
                var sended = false
                let member = await guild.members.fetch(user.id).catch(async err => { //NOT WORKING WITHOUT INTENT AND USING client.shard.broadcastEval
                    console.log("Error")
                    if (err.code === 10007) {
                        try {
                            await messageReaction.users.remove(user.id)
                        } catch (error) {
                            console.error(error);
                        }
                        const embed = new Discord.MessageEmbed().setAuthor(`${lang.reactError}`, 'https://ezzud.fr/images/closedFixed.png').setColor('#ED3016').setDescription(`${lang.reactNoServer.split("%requiredServerName%").join(gw2[0].requiredServerName)}`).addField(`\u200B`, `${lang.winButton.split("%link%").join(`https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)} ${lang.reactErrorMessage}`)
                        user.send(embed).catch(error => {
                            if (error.code === 50007) {
                                console.log(`Erreur: L'utilisateur n'a pas pu être DM`)
                            }
                        })
                        sended = true;
                    }
                })
                if (sended === true) return;
                if (!member) {
                    try {
                        await messageReaction.users.remove(user.id)
                    } catch (error) {
                        console.error(error);
                    }
                    const embed = new Discord.MessageEmbed().setAuthor(`${lang.reactError}`, 'https://ezzud.fr/images/closedFixed.png').setColor('#ED3016').setDescription(`${lang.reactNoServer.split("%requiredServerName%").join(gw2[0].requiredServerName)}`).addField(`\u200B`, `${lang.winButton.split("%link%").join(`https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}`)} ${lang.reactErrorMessage}`)
                    user.send(embed).catch(error => {
                        if (error.code === 50007) {
                            console.log(`Erreur: L'utilisateur n'a pas pu être DM`)
                        }
                    })
                }
            }
        }
    }
}