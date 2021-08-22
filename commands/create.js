'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
const db = require('quick.db')
const Topgg = require(`@top-gg/sdk`)
const config = require('../config.json')
var api;
if (config.topggEnabled === true) {
    api = new Topgg.Api(config.topggToken)
}
module.exports.run = async (client, pf, message, args, manager, json, lang) => {
    console.log = function(d) {
        let date = new Date();
        date.setHours(date.getHours() + 1); //
        fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8", {
            'flags': 'a+'
        });
        log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
    };
    var data = new db.table("serverInfo")
    if (message.guild.member(message.author).hasPermission(32) === false) {
        let role = message.guild.member(message.author).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
    }
    let giveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    giveaways = giveaways.filter((g) => g.ended !== true);
    if (config.topggEnabled === true) {
        if (api.hasVoted(message.author.id) === false) {
            if (giveaways.length >= 10) {
                let tmEmbed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.NoVotedGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send(tmEmbed));
            }
        } else {
            if (giveaways.length >= 20) {
                let tm2Embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.TooMuchGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send(tm2Embed));
            }
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    let opembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationActive.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.member(client.user).hasPermission(379968)) return (message.channel.send(permembed));
    if (await data.get(`${message.guild.id}.creation`) === 'on') return (message.channel.send(opembed));
    await data.set(`${message.guild.id}.creation`, 'on')
    await data.set(`${message.guild.id}.channel`, ':x:')
    await data.set(`${message.guild.id}.time`, ':x:')
    await data.set(`${message.guild.id}.winnerstr`, ':x:')
    await data.set(`${message.guild.id}.price`, ':x:')
    await data.set(`${message.guild.id}.isrequiredrole`, ':x:')
    await data.set(`${message.guild.id}.requiredrole`, ':x:')
    await data.set(`${message.guild.id}.isrequiredserver`, ':x:')
    await data.set(`${message.guild.id}.requiredserver`, ':x:')
    await data.set(`${message.guild.id}.requiredservername`, ':x:')
    let embedd = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createEmbedFieldEmpty).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
    const member = message.author.id
    const channelID = message.channel.id
    let embed;
    await message.channel.send(embedd).then(async msg => {
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send(embed)
        let answered;
        answered = false
        while (answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                max: 1,
                time: 60000
            }).then(async collected => {
                let col = collected.first()
                if (!col) {
                    answered = false
                    return;
                }
                col = col.content
                if (!col) return (console.log("No Content"));
                let mess = collected.first().content
                if (message.channel.id !== channelID) {
                    answered = false
                    return;
                }
                if (collected.first().author.id !== member) {
                    answered = false
                    return;
                }
                if (mess === "cancel") {
                    await data.set(`${message.guild.id}.channel`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                mess = mess.replace('<', '')
                mess = mess.replace('>', '')
                mess = mess.replace('#', '')
                let channel = message.guild.channels.cache.get(mess)
                if (!channel) {
                    await data.set(`${message.guild.id}.channel`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    if (channel.type !== 'text') {
                        await data.set(`${message.guild.id}.channel`, ':x:')
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelTextError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        return message.channel.send(embed);
                    }
                    await data.set(`${message.guild.id}.channel`, channel.id)
                    let new_channel = `<#${await data.get(`${message.guild.id}.channel`)}>`
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createEmbedFieldChannel.split("%new_channel%").join(new_channel)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    await msg.edit(editembed)
                    answered = true
                }
            }).catch(async (err) => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await data.set(`${message.guild.id}.creation`, 'off')
                await data.set(`${message.guild.id}.channel`, ':x:')
                console.log(err)
                answered = true
                return;
            });
        }
        if (data.get(`${message.guild.id}.channel`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (!message.guild.channels.cache.get(data.get(`${message.guild.id}.channel`)).memberPermissions(message.guild.member(client.user)).has(379968)) {
            message.channel.send(lang.createChannelPermissionWarning)
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createDurationMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send(embed)
        answered = false
        while (answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                max: 1,
                time: 60000
            }).then(async collected => {
                if (!collected.first().content) return;
                let mess = collected.first().content
                if (message.channel.id !== channelID) {
                    answered = false
                    return;
                }
                if (collected.first().author.id !== member) {
                    answered = false
                    return;
                }
                if (mess === "cancel") {
                    await data.set(`${message.guild.id}.time`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                let timems = ms(mess)
                if (!timems) {
                    await data.set(`${message.guild.id}.time`, ':x:')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createDurationError.splice("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    if (timems > 5184000000) {
                        embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startTooLargeDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        return (message.channel.send(embed));
                    } else if (timems > 596160000) {
                        if (await api.hasVoted(message.author.id) === false) {
                            embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoVoted.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                            return (message.channel.send(embed));
                        }
                    }
                    mess = mess.replace(/-/g, '')
                    await data.set(`${message.guild.id}.time`, mess)
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createDurationField.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    await msg.edit(editembed)
                    answered = true
                }
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await data.set(`${message.guild.id}.creation`, 'off')
                await data.set(`${message.guild.id}.time`, ':x:')
                answered = true
                return;
            });
        }
        if (data.get(`${message.guild.id}.time`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createWinnersMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send(embed)
        answered = false
        while (answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                max: 1,
                time: 60000
            }).then(async collected => {
                if (!collected.first().content) return;
                let mess = collected.first().content
                if (message.channel.id !== channelID) {
                    answered = false
                    return;
                }
                if (collected.first().author.id !== member) {
                    answered = false
                    return;
                }
                if (mess === "cancel") {
                    await data.set(`${message.guild.id}.winnerstr`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                mess = mess.replace(/-/g, '')
                mess = parseInt(mess)
                mess = mess.toString()
                if (mess === 'NaN') {
                    await data.set(`${message.guild.id}.winnerstr`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createWinnersError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    parseInt(mess)
                    Math.trunc(mess);
                    await data.set(`${message.guild.id}.winnerint`, mess)
                    await data.set(`${message.guild.id}.winnerstr`, mess.toString())
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createWinnersField.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit(editembed)
                }
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await data.set(`${message.guild.id}.creation`, 'off')
                await data.set(`${message.guild.id}.winnerstr`, ':x:')
                answered = true
                return;
            });
        }
        if (data.get(`${message.guild.id}.winnerstr`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createPrizeMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send(embed)
        answered = false
        while (answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                max: 1,
                time: 60000
            }).then(async collected => {
                if (!collected.first().content) return;
                let mess = collected.first().content
                if (message.channel.id !== channelID) {
                    answered = false
                    return;
                }
                if (collected.first().author.id !== member) {
                    answered = false
                    return;
                }
                if (mess === "cancel") {
                    await data.set(`${message.guild.id}.price`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                if (mess.lenght > 100) {
                    await data.set(`${message.guild.id}.price`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createPrizeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    await data.set(`${message.guild.id}.price`, mess)
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createPrizeField.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit(editembed)
                }
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await data.set(`${message.guild.id}.creation`, 'off')
                await data.set(`${message.guild.id}.price`, ':x:')
                answered = true
                return;
            });
        }
        if (data.get(`${message.guild.id}.price`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleAMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send(embed)
        answered = false
        while (answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                max: 1,
                time: 60000
            }).then(async collected => {
                if (!collected.first().content) return;
                let mess = collected.first().content
                if (message.channel.id !== channelID) {
                    answered = false
                    return;
                }
                if (collected.first().author.id !== member) {
                    answered = false
                    return;
                }
                if (mess === "cancel") {
                    await data.set(`${message.guild.id}.isrequiredrole`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return msg.delete();
                }
                mess = mess.toLowerCase();
                if (mess !== "oui" && mess !== "non" && mess !== "no" && mess !== "yes") {
                    await data.set(`${message.guild.id}.creation`, 'off')
                    await data.set(`${message.guild.id}.isrequiredrole`, ':x:')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleAError.splice("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                }
                if (mess === "yes") {
                    mess = "oui"
                }
                if (mess === "no") {
                    mess = "non"
                }
                await data.set(`${message.guild.id}.isrequiredrole`, mess)
                await data.set(`${message.guild.id}.requiredrole`, mess)
                var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createRoleAField.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredrole%").join(await data.get(`${message.guild.id}.isrequiredrole`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                answered = true
                await msg.edit(editembed)
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await data.set(`${message.guild.id}.creation`, 'off')
                await data.set(`${message.guild.id}.isrequiredrole`, ':x:')
                answered = true
                return;
            });
        }
        if (data.get(`${message.guild.id}.isrequiredrole`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        if (await data.get(`${message.guild.id}.isrequiredrole`) === 'oui') {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMMessage).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send(embed)
            answered = false
            while (answered === false) {
                await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000
                }).then(async collected => {
                    if (!collected.first().content) return;
                    let mess = collected.first().content
                    if (message.channel.id !== channelID) {
                        answered = false
                        return;
                    }
                    if (collected.first().author.id !== member) {
                        answered = false
                        return;
                    }
                    if (mess === "cancel") {
                        await data.set(`${message.guild.id}.requiredrole`, ':x:')
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return msg.delete();
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('@&', '')
                    mess = mess.replace(' ', '')
                    let role = message.guild.roles.cache.get(mess)
                    if (!role) {
                        await data.set(`${message.guild.id}.requiredrole`, ':x:')
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return;
                    } else {
                        await data.set(`${message.guild.id}.requiredrole`, role.id)
                    }
                    if (await data.get(`${message.guild.id}.requiredrole`) === ':x:') return;
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createRoleMField.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredrole%").join(`<@&${await data.get(`${message.guild.id}.requiredrole`)}>`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit(editembed)
                }).catch(async () => {
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    await data.set(`${message.guild.id}.creation`, 'off')
                    await data.set(`${message.guild.id}.requiredrole`, ':x:')
                    answered = true
                    return;
                });
            }
        }
        if (data.get(`${message.guild.id}.requiredrole`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send(embed)
        answered = false
        while (answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                max: 1,
                time: 60000
            }).then(async collected => {
                if (!collected.first().content) return;
                let mess = collected.first().content
                if (message.channel.id !== channelID) {
                    answered = false
                    return;
                }
                if (collected.first().author.id !== member) {
                    answered = false
                    return;
                }
                if (mess === "cancel") {
                    await data.set(`${message.guild.id}.isrequiredserver`, ':x:')
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return msg.delete();
                }
                mess = mess.toLowerCase();
                if (mess !== "oui" && mess !== "non" && mess !== "yes" && mess !== "no") {
                    await data.set(`${message.guild.id}.creation`, 'off')
                    await data.set(`${message.guild.id}.isrequiredserver`, ':x:')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerError.split("%nope%").join("client.nope")).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                }
                if (mess === "yes") {
                    mess = "oui"
                }
                if (mess === "no") {
                    mess = "non"
                }
                await data.set(`${message.guild.id}.isrequiredserver`, mess)
                var editembed;
                if (await data.get(`${message.guild.id}.isrequiredrole`) === "oui") {
                    editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerFieldRole.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredrole%").join(`<@&${await data.get(`${message.guild.id}.requiredrole`)}>`).split("%requiredserver%").join(await data.get(`${message.guild.id}.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                } else {
                    editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerFieldNoRole.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredserver%").join(await data.get(`${message.guild.id}.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                }
                answered = true
                await msg.edit(editembed)
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await data.set(`${message.guild.id}.creation`, 'off')
                await data.set(`${message.guild.id}.isrequiredserver`, ':x:')
                answered = true
                return;
            });
        }
        if (data.get(`${message.guild.id}.isrequiredserver`) === ':x:') {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        if (await data.get(`${message.guild.id}.isrequiredserver`) === 'oui') {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIMessage).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send(embed)
            answered = false
            while (answered === false) {
                await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000
                }).then(async collected => {
                    if (!collected.first().content) return;
                    let mess = collected.first().content
                    if (message.channel.id !== channelID) {
                        answered = false
                        return;
                    }
                    if (collected.first().author.id !== member) {
                        answered = false
                        return;
                    }
                    if (mess === "cancel") {
                        await data.set(`${message.guild.id}.requiredserver`, ':x:')
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return msg.delete();
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('@&', '')
                    mess = mess.replace(' ', '')
                    let role = await client.guilds.fetch(mess)
                    if (!role) {
                        await data.set(`${message.guild.id}.requiredserver`, ':x:')
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return;
                    } else {
                        await data.set(`${message.guild.id}.requiredserver`, role.id)
                        await data.set(`${message.guild.id}.requiredservername`, role.name)
                    }
                    if (await data.get(`${message.guild.id}.requiredrole`) === ':x:') return;
                    var editembed;
                    if (await data.get(`${message.guild.id}.isrequiredrole`) === "oui") {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldRole.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredrole%").join(`<@&${await data.get(`${message.guild.id}.requiredrole`)}>`).split("%requiredserver%").join(await data.get(`${message.guild.id}.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    } else {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldNoRole.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredserver%").join(`${client.guilds.cache.get(await data.get(`${message.guild.id}.requiredserver`)).name}`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    }
                    answered = true
                    await msg.edit(editembed)
                }).catch(async (err) => {
                    console.log(err)
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    await data.set(`${message.guild.id}.creation`, 'off')
                    await data.set(`${message.guild.id}.requiredserver`, ':x:')
                    answered = true
                    return;
                });
            }
        }
        if (await data.get(`${message.guild.id}.isrequiredserver`) === 'oui') {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerInvite).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send(embed)
            answered = false
            while (answered === false) {
                await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000
                }).then(async collected => {
                    if (!collected.first().content) return;
                    let mess = collected.first().content
                    if (message.channel.id !== channelID) {
                        answered = false
                        return;
                    }
                    if (collected.first().author.id !== member) {
                        answered = false
                        return;
                    }
                    if (mess === "cancel") {
                        await data.set(`${message.guild.id}.requiredserverinvite`, ':x:')
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return msg.delete();
                    }
                    let server = await client.guilds.fetch(await data.get(`${message.guild.id}.requiredserver`));
                    if(mess === "none") {
                        
                        if(!server.member(client.user).hasPermission("CREATE_INSTANT_INVITE")) {
                            await data.set(`${message.guild.id}.requiredserverinvite`, ':x:')
                            await data.set(`${message.guild.id}.creation`, 'off')
                            answered = true
                            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerInviteError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                            message.channel.send(embed)
                            return;                           
                        }
                        var chx = server.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
                        let invite = await chx.createInvite({
                            temporary: false,
                            maxAge: 0
                        })
                        await data.set(`${message.guild.id}.requiredserverinvite`, invite.url)
                    } else {
                        let invites = await server.fetchInvites()
                        if(!invites.find(x => x.url === mess)) {
                            await data.set(`${message.guild.id}.requiredserverinvite`, ':x:')
                            await data.set(`${message.guild.id}.creation`, 'off')
                            answered = true
                            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerInviteNotInServer.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                            message.channel.send(embed)
                            return; 
                        } else {
                           await data.set(`${message.guild.id}.requiredserverinvite`, mess) 
                        }
                    }
                    
                    if (await data.get(`${message.guild.id}.requiredserverinvite`) === ':x:') return;
                    var editembed;
                    if (await data.get(`${message.guild.id}.isrequiredrole`) === "oui") {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldRole.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredrole%").join(`<@&${await data.get(`${message.guild.id}.requiredrole`)}>`).split("%requiredserver%").join(await data.get(`${message.guild.id}.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    } else {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldNoRole.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredserver%").join(`${client.guilds.cache.get(await data.get(`${message.guild.id}.requiredserver`)).name}`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    }
                    answered = true
                    await msg.edit(editembed)
                }).catch(async (err) => {
                    console.log(err)
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    await data.set(`${message.guild.id}.creation`, 'off')
                    await data.set(`${message.guild.id}.requiredserver`, ':x:')
                    answered = true
                    return;
                });
            }
        }




        msg.delete()
    })
    if (data.get(`${message.guild.id}.channel`) === ':x:' || data.get(`${message.guild.id}.time`) === ':x:' || data.get(`${message.guild.id}.winnerstr`) === ':x:' || data.get(`${message.guild.id}.price`) === ':x:') {
        await data.set(`${message.guild.id}.creation`, 'off')
        return;
    }
    if (data.get(`${message.guild.id}.creation`) === 'off') {
        return;
    }
    let editedembed;
    let Isrequiredrole;
    let requiredrole;
    if (await data.get(`${message.guild.id}.isrequiredrole`) === 'oui') {
        Isrequiredrole = true
        requiredrole = data.get(`${message.guild.id}.requiredrole`)
    } else {
        Isrequiredrole = false
        requiredrole = null
    }
    let role_activation;
    if (await data.get(`${message.guild.id}.isrequiredrole`) === "oui") {
        role_activation = lang.activated
    } else if (await data.get(`${message.guild.id}.isrequiredrole`) === "non") {
        role_activation = lang.desactivated
    }
    let server_activation;
    if (await data.get(`${message.guild.id}.isrequiredserver`) === "oui") {
        server_activation = lang.activated
    } else if (await data.get(`${message.guild.id}.isrequiredserver`) === "non") {
        server_activation = lang.desactivated
    }
    editedembed = new Discord.MessageEmbed().setTitle(`TADAA`).setDescription(lang.createConfirmHeader.split("%what%").join(client.what)).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createConfirmField.split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`).split("%duration%").join(await data.get(`${message.guild.id}.time`)).split("%winners%").join(await data.get(`${message.guild.id}.winnerstr`)).split("%prize%").join(await data.get(`${message.guild.id}.price`)).split("%requiredrole%").join(role_activation).split("%requiredserver%").join(server_activation)).setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL())
    let isrequiredserver;
    let requiredserver;
    let requiredservername;
    let requiredserverinvite;
    if (await data.get(`${message.guild.id}.isrequiredserver`) === 'oui') {
        isrequiredserver = true;
        requiredserver = await data.get(`${message.guild.id}.requiredserver`);
        requiredservername = await data.get(`${message.guild.id}.requiredservername`);
        requiredserverinvite = await data.get(`${message.guild.id}.requiredserverinvite`) || undefined;
    } else {
        isrequiredserver = false;
        requiredserver = null;
        requiredservername = null;
        requiredserverinvite = null;
    }
    message.channel.send(editedembed).then(async msg2 => {
        await msg2.react('✅');
        await msg2.react('❌');
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        await msg2.awaitReactions(filter, {
            max: 1,
            time: 60000,
            errors: ['time']
        }).then(async collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === '✅') {
                msg2.delete()
                await data.set(`${message.guild.id}.creation`, `off`)
                if (!await data.get(`${message.guild.id}.rainbow`)) {
                    await data.set(`${message.guild.id}.rainbow`, false)
                }
                manager.start(message.guild.channels.cache.get(`${data.get(`${message.guild.id}.channel`)}`), {
                    time: ms(`${data.get(`${message.guild.id}.time`)}`),
                    prize: `${data.get(`${message.guild.id}.price`)}`,
                    winnerCount: parseInt(`${data.get(`${message.guild.id}.winnerstr`)}`),
                    IsRequiredRole: Isrequiredrole,
                    requiredRole: requiredrole,
                    IsRequiredServer: isrequiredserver,
                    requiredServer: requiredserver,
                    requiredServerInvite: requiredserverinvite,
                    lang: lang.id,
                    shardID: client.shard.ids[0],
                    hostedBy: message.author.id,
                    rainbow: await data.get(`${message.guild.id}.rainbow`) || false,
                    requiredServerName: requiredservername
                }).then(async (gData) => {
                    console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
                    embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createConfirmSuccess.split("%okay%").join(client.okay).split("%channel%").join(`<#${await data.get(`${message.guild.id}.channel`)}>`)).setFooter(lang.footer.split("%version%").join(json.version))
                    await message.channel.send(embed)
                    await data.set(`${message.guild.id}.channel`, `:x:`)
                    await data.set(`${message.guild.id}.time`, `:x:`)
                    await data.set(`${message.guild.id}.winnerstr`, `:x:`)
                    await data.set(`${message.guild.id}.price`, `:x:`)
                    const stats = new db.table("stats")
                    if (!await stats.get("creation_count")) {
                        await stats.set("creation_count", 0)
                    }
                    await stats.add(`creation_count`, 1)
                }).catch(async (err) => {
                    console.error(err)
                });
            } else {
                msg2.delete()
                await data.set(`${message.guild.id}.channel`, `:x:`)
                await data.set(`${message.guild.id}.time`, `:x:`)
                await data.set(`${message.guild.id}.winnerstr`, `:x:`)
                await data.set(`${message.guild.id}.price`, `:x:`)
                await data.set(`${message.guild.id}.creation`, `off`)
            }
        }).catch(() => {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        });
    })
}
module.exports.help = {
    name: "create"
}