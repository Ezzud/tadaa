'use strict';
const Discord = require('discord.js');
let emojiMap = {
    link: "732605373185261629",
    dev: "732605373185261608",
    sharding: "732605372954575029",
    computer: "732607541061877760",
    memoire: "732698462822596659",
    okay: "732581317098602546",
    nope: "732581316880498782",
    info: "732581319971831808",
    what: "732581319678361662",
    warn: "732581316217929782"
};
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

function getEmoji(name) {
    return `<:${name}:${emojiMap[name]}>`;
}
var api;
if (config.topggEnabled === true) {
    api = new Topgg.Api(config.topggToken)
}
/* /////////////////////////////////////////////////


        Main Code


*/ /////////////////////////////////////////////////
module.exports = async (client, message) => {
    const manager = client.giveawaysManager;
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    var data = new db.table("serverInfo")
    let pf = await data.get(`${message.guild.id}.prefix`)
    if (!pf) {
        pf = config.prefix
        await data.set(`${message.guild.id}.prefix`, pf)
        console.log(`- Création d'une table de donnée pour le serveur "${message.guild.name}" `)
    }
    var lang = await data.get(`${message.guild.id}.lang`)
    if (!lang) {
        lang = "en_US"
        await data.set(`${message.guild.id}.lang`, "en_US")
    }
    lang = require(`../lang/${lang}.json`)
    const langage = lang
    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) {
        var embed = new Discord.MessageEmbed().setAuthor(`TADAA`, client.user.avatarURL).setDescription(`${lang.mentionEmbed.split("%pf%").join(pf)}`).setColor(`#F67272`).setTimestamp().setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL)
        message.channel.send(embed)
    }
    if (message.content.startsWith(pf)) {
        let args = message.content.slice(pf.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();
        client.nope = getEmoji("nope")
        client.info = getEmoji("info")
        client.okay = getEmoji("okay")
        client.what = getEmoji("what")
        client.warning = getEmoji("warn")
        client.loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`
        let commands_file = client.commands.get(command);
        if (commands_file && !message.guild.channels.cache.get(message.channel.id).memberPermissions(message.guild.member(client.user)).has(2048)) {
            let noPermembed = new Discord.MessageEmbed().setAuthor(`TADAA`, client.user.avatarURL).setDescription(`${getEmoji("nope")} ${lang.noPermission}`).setColor(`#F67272`).setTimestamp().setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL)
            return message.author.send(noPermembed);
        }
        if (config.topggEnabled === true) {
            const request = client.votes
            if (command === 'delete' || command === 'end' || command === 'start' || command === "create") {
                if (!request) {
                    if (gwDelay.has(message.author.id)) {
                        let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return;
                    } else {
                        gwDelay.add(message.author.id)
                        setTimeout(() => {
                            gwDelay.delete(message.author.id)
                        }, 10000)
                    }
                } else {
                    if (request.find(x => x.id === message.author.id)) {
                        if (voterGwDelay.has(message.author.id)) {
                            let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWVotedcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                            message.channel.send(embed)
                            return;
                        } else {
                            voterGwDelay.add(message.author.id)
                            setTimeout(() => {
                                voterGwDelay.delete(message.author.id)
                            }, 5000)
                        }
                    } else {
                        if (gwDelay.has(message.author.id)) {
                            let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                            message.channel.send(embed)
                            return;
                        } else {
                            gwDelay.add(message.author.id)
                            setTimeout(() => {
                                gwDelay.delete(message.author.id)
                            }, 10000)
                        }
                    }
                }
            } else {
                if (!request) {
                    if (gwDelay.has(message.author.id)) {
                        let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.GWcommandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return;
                    } else {
                        gwDelay.add(message.author.id)
                        setTimeout(() => {
                            gwDelay.delete(message.author.id)
                        }, 3000)
                    }
                } else {
                    if (!request.find(x => x.id === message.author.id)) {
                        if (delay.has(message.author.id)) {
                            let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('E3260F').addField(`\u200B`, `${lang.commandCooldown}`).setFooter(lang.footer.split("%version%").join(json.version))
                            message.channel.send(embed)
                            return;
                        } else {
                            delay.add(message.author.id)
                            setTimeout(() => {
                                delay.delete(message.author.id)
                            }, 3000)
                        }
                    }
                }
            }
        }
        let commande_file = client.commands.get(command);
        if (!await stats.get("command_count")) {
            await stats.set("command_count", 0)
        }
        await stats.add(`command_count`, 1)
        if (commande_file) commande_file.run(client, pf, message, args, manager, json, langage);
    }
};