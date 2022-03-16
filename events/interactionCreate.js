'use strict';
const Discord = require('discord.js');

/* /////////////////////////////////////////////////


        Variables


*/ /////////////////////////////////////////////////
const config = require('../config.json')
const json = require('../package.json')
const fs = require('fs');
const db = require('quick.db')
const stats = new db.table("stats")
const delay = new Set()
const gwDelay = new Set()
const voterGwDelay = new Set()
const GiveawaysManager = require('../src/Manager');
const Topgg = require(`@top-gg/sdk`)


var api;
/* /////////////////////////////////////////////////


        Main Code


*/ /////////////////////////////////////////////////
module.exports = async (client, message) => {
    const manager = client.giveawaysManager;
    if (message.user.bot) return;
    if (message.channel.type === 'dm') return;
    var data = new db.table("serverInfo");
    let pf = await data.get(`${message.guild.id}.prefix`);
    if (!pf) {
        pf = config.prefix;
        await data.set(`${message.guild.id}.prefix`, pf);
        console.log(`- Création d'une table de donnée pour le serveur "${message.guild.name}" `);
    }
    var lang = await data.get(`${message.guild.id}.lang`);
    if (!lang) {
        lang = "en_US";
        await data.set(`${message.guild.id}.lang`, "en_US");
    }
    lang = require(`../lang/${lang}.json`);
    const langage = lang
    if (message.isCommand()) {
        let command = message.commandName
        
        let commands_file = client.commands.get(command);
        if (config.topggEnabled === true) {
            const request = client.votes;
            if (command === 'delete' || command === 'end' || command === 'start' || command === "create" || command === "reroll" || command === "edit") {
                if (!request) {
                    if (gwDelay.has(message.user.id)) {
                        let embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                        message.reply({ embeds: [embed], ephemeral:true})
                        return;
                    } else {
                        gwDelay.add(message.user.id);
                        setTimeout(() => {
                            gwDelay.delete(message.user.id);
                        }, 10000)
                    }
                } else {
                    if (request.find(x => x.id === message.user.id)) {
                        if (voterGwDelay.has(message.user.id)) {
                            let embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWVotedcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                            message.reply({ embeds: [embed], ephemeral:true})
                            return;
                        } else {
                            voterGwDelay.add(message.user.id)
                            setTimeout(() => {
                                voterGwDelay.delete(message.user.id)
                            }, 5000)
                        }
                    } else {
                        if (gwDelay.has(message.user.id)) {
                            let embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                            message.reply({ embeds: [embed], ephemeral:true})
                            return;
                        } else {
                            gwDelay.add(message.user.id);
                            setTimeout(() => {
                                gwDelay.delete(message.user.id);
                            }, 10000)
                        }
                    }
                }
            } else {
                if (!request) {
                    if (gwDelay.has(message.user.id)) {
                        let embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                        message.reply({ embeds: [embed], ephemeral:true})
                        return;
                    } else {
                        gwDelay.add(message.user.id)
                        setTimeout(() => {
                            gwDelay.delete(message.user.id)
                        }, 3000)
                    }
                } else {
                    if (!request.find(x => x.id === message.user.id)) {
                        if (delay.has(message.user.id)) {
                            let embed = new Discord.MessageEmbed().setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.commandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                            message.reply({ embeds: [embed], ephemeral:true})
                            return;
                        } else {
                            delay.add(message.user.id)
                            setTimeout(() => {
                                delay.delete(message.user.id)
                            }, 3000)
                        }
                    }
                }
            }
        }
        let commande_file = client.commands.get(command);
        if (commande_file) commande_file.run(client, pf, message, manager, json, langage);
        if (!await stats.get("command_count")) {
            await stats.set("command_count", 0)
        }
        await stats.add(`command_count`, 1)
    }
    if(message.isSelectMenu()) {
        
        let menu = client.selectMenu;
        switch(message.customId) {
            case "reroll_id":
                await message.deferReply()
                menu.reroll(lang, message.values[0], message)
                break;
            case "end_id":
                await message.deferReply()
                menu.end(lang, message.values[0], message)    
                break;
            case "delete_id":
                await message.deferReply()
                menu.delete(lang, message.values[0], message)
                break;
            case "edit_id":
                await message.deferReply()
                menu.edit(lang, message.values[0], message)
                break;
        }
    }
};