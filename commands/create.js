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
module.exports.run = async(client, pf, message, args, manager, json, lang) => {
    console.log = function(d) {
        let date = new Date();
        date.setHours(date.getHours() + 1); //
        fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8", {
            'flags': 'a+'
        });
        log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
    };
    var data = new db.table("serverInfo")
    if (message.guild.members.cache.get(message.author.id).permissions.has(32) === false) {
        let role = message.guild.members.cache.get(message.author.id).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [embed] })
            return;
        }
    }
    let giveaways = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    giveaways = giveaways.filter((g) => g.ended !== true);
    if (config.topggEnabled === true) {
        if (api.hasVoted(message.author.id) === false) {
            if (giveaways.length >= 10) {
                let tmEmbed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.NoVotedGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send({ embeds: [tmEmbed] }));
            }
        } else {
            if (giveaways.length >= 20) {
                let tm2Embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.TooMuchGW.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return (message.channel.send({ embeds: [tm2Embed] }));
            }
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    let opembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationActive.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.members.cache.get(client.user.id).permissions.has(379968)) return (message.channel.send({ embeds: [permembed] }));
    if (await data.get(`${message.guild.id}.creation`) === 'on' && await data.get(`${message.guild.id}.creation`) !== undefined) return (message.channel.send({ embeds: [opembed] }));
    await data.set(`${message.guild.id}.creation`, 'on')
    var creationChannel = ":x:"
    var creationTime = ":x:"
    var creationWinner = ":x:"
    var creationPrice = ":x:"
    var creationIsRequiredRole = ":x:"
    var creationRequiredRole = ":x:"
    var creationIsRequiredServer = ":x:"
    var creationRequiredServer = ":x:"
    var creationRequiredServerName = ":x:"
    var creationRequiredServerInvite = ":x:"
    let embedd = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createEmbedFieldEmpty).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
    const member = message.author.id
    const channelID = message.channel.id
    let embed;
    await message.channel.send({ embeds: [embedd] }).then(async msg => {
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send({ embeds: [embed] })
        let answered;
        answered = false
        while (answered === false) {
            let filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000
            }).then(async collected => {
                let col = collected.first()
                if (!col) {
                    console.log("No Collect")
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
                    creationChannel = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    answered = true
                    return msg.delete();
                }
                mess = mess.replace('<', '')
                mess = mess.replace('>', '')
                mess = mess.replace('#', '')
                let channel = message.guild.channels.cache.get(mess)
                if (!channel) {
                    creationChannel = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return;
                } else {
                    if (channel.type !== 'GUILD_TEXT' && channel.type !== 'GUILD_NEWS' && channel.type !== 'GUILD_STORE' && channel.type !== 'GUILD_PUBLIC_THREAD' && channel.type !== 'GUILD_PRIVATE_THREAD') {
                        creationChannel = ":x:"
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelTextError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        return message.channel.send({ embeds: [embed] });
                    }
                    creationChannel = channel.id
                    let new_channel = `<#${creationChannel}>`
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createEmbedFieldChannel.split("%new_channel%").join(new_channel)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    await msg.edit({ embeds: [editembed] })
                    answered = true
                }
            }).catch(async(err) => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [embed] })
                await data.set(`${message.guild.id}.creation`, 'off')
                creationChannel = ":x:"
                console.log(err)
                answered = true
                return;
            });
        }
        if (creationChannel === ":x:") {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (!message.guild.channels.cache.get(creationChannel).memberPermissions(message.guild.members.cache.get(client.user.id)).has(379968)) {
            message.channel.send(lang.createChannelPermissionWarning)
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createDurationMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send({ embeds: [embed] })
        answered = false
        while (answered === false) {
            let filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages({
                filter,
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
                    creationTime = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    answered = true
                    return msg.delete();
                }
                let timems = ms(mess)
                if (!timems) {
                    creationTime = ":x:"
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createDurationError.splice("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return;
                } else {
                    if (timems > 5184000000) {
                        embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startTooLargeDuration.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        return (message.channel.send({ embeds: [embed] }));
                    } else if (timems > 596160000) {
                        if (await api.hasVoted(message.author.id) === false) {
                            embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.startNoVoted.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                            return (message.channel.send({ embeds: [embed] }));
                        }
                    }
                    mess = mess.replace(/-/g, '')
                    creationTime = mess
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createDurationField.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    await msg.edit({ embeds: [editembed] })
                    answered = true
                }
            }).catch(async() => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [embed] })
                await data.set(`${message.guild.id}.creation`, 'off')
                creationTime = ":x:"
                answered = true
                return;
            });
        }
        if (creationTime === ":x:") {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createWinnersMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send({ embeds: [embed] })
        answered = false
        while (answered === false) {
            let filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages({
                filter,
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
                    creationWinner = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    answered = true
                    return msg.delete();
                }
                mess = mess.replace(/-/g, '')
                mess = parseInt(mess)
                mess = mess.toString()
                if (mess === 'NaN') {
                    creationWinner = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createWinnersError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return;
                } else {
                    parseInt(mess)
                    Math.trunc(mess);
                    creationWinner = mess.toString();
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createWinnersField.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit({ embeds: [editembed] })
                }
            }).catch(async() => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [embed] })
                await data.set(`${message.guild.id}.creation`, 'off')
                creationWinner = ":x:"
                answered = true
                return;
            });
        }
        if (creationWinner === ":x:") {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createPrizeMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send({ embeds: [embed] })
        answered = false
        while (answered === false) {
            let filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages({
                filter,
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
                    creationPrice = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    answered = true
                    return msg.delete();
                }
                if (mess.lenght > 50) {
                    creationPrice = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createPrizeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return;
                } else {
                    creationPrice = mess
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createPrizeField.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit({ embeds: [editembed] })
                }
            }).catch(async() => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [embed] })
                await data.set(`${message.guild.id}.creation`, 'off')
                creationPrice = ":x:"
                answered = true
                return;
            });
        }
        if (creationPrice === ":x:") {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleAMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send({ embeds: [embed] })
        answered = false
        while (answered === false) {
            let filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages({
                filter,
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
                    creationIsRequiredRole = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return msg.delete();
                }
                mess = mess.toLowerCase();
                if (mess !== "oui" && mess !== "non" && mess !== "no" && mess !== "yes") {
                    await data.set(`${message.guild.id}.creation`, 'off')
                    creationIsRequiredRole = ":x:"
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleAError.splice("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return;
                }
                if (mess === "yes") {
                    mess = "oui"
                }
                if (mess === "no") {
                    mess = "non"
                }
                creationIsRequiredRole = mess
                var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createRoleAField.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredrole%").join(creationIsRequiredRole)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                answered = true
                await msg.edit({ embeds: [editembed] })
            }).catch(async() => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [embed] })
                await data.set(`${message.guild.id}.creation`, 'off')
                creationIsRequiredRole = ":x:"
                answered = true
                return;
            });
        }
        if (creationIsRequiredRole === ":x:") {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (await data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        if (creationIsRequiredRole === "oui") {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMMessage).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send({ embeds: [embed] })
            answered = false
            while (answered === false) {
                let filter = m => m.author.id === message.author.id
                await message.channel.awaitMessages({
                    filter,
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
                        creationRequiredRole = ":x:"
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send({ embeds: [embed] })
                        return msg.delete();
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('@&', '')
                    mess = mess.replace(' ', '')
                    let role = message.guild.roles.cache.get(mess)
                    if (!role) {
                        creationRequiredRole = ":x:"
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send({ embeds: [embed] })
                        return;
                    } else {
                        creationRequiredRole = role.id
                    }
                    if (creationRequiredRole === ":x:") return;
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createRoleMField.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredrole%").join(`<@&${creationRequiredRole}>`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit({ embeds: [editembed] })
                }).catch(async function() {
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version));
                    message.channel.send({ embeds: [embed] });
                    await data.set(`${message.guild.id}.creation`, 'off');
                    creationRequiredRole = ":x:";
                    answered = true;
                    return;
                });
            }
            if (creationRequiredRole === ":x:") {
                await data.set(`${message.guild.id}.creation`, 'off')
                return;
            }
            if (data.get(`${message.guild.id}.creation`) === 'off') {
                return;
            }
        }
        embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerMessage).setFooter(lang.footer.split("%version%").join(json.version))
        await message.channel.send({ embeds: [embed] })
        answered = false
        while (answered === false) {
            let filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages({
                filter,
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
                    creationIsRequiredServer = ":x:"
                    await data.set(`${message.guild.id}.creation`, 'off')
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return msg.delete();
                }
                mess = mess.toLowerCase();
                if (mess !== "oui" && mess !== "non" && mess !== "yes" && mess !== "no") {
                    await data.set(`${message.guild.id}.creation`, 'off')
                    creationIsRequiredServer = ":x:"
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerError.split("%nope%").join("client.nope")).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    return;
                }
                if (mess === "yes") {
                    mess = "oui"
                }
                if (mess === "no") {
                    mess = "non"
                }
                creationIsRequiredServer = mess
                var editembed;
                if (creationIsRequiredRole === "oui") {
                    editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerFieldRole.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredrole%").join(`<@&${creationRequiredRole}>`).split("%requiredserver%").join(creationIsRequiredServer)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                } else {
                    editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerFieldNoRole.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredserver%").join(creationIsRequiredServer)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                }
                answered = true
                await msg.edit({ embeds: [editembed] })
            }).catch(async() => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [embed] })
                await data.set(`${message.guild.id}.creation`, 'off')
                creationIsRequiredServer = ":x:"
                answered = true
                return;
            });
        }
        if (creationIsRequiredServer === ":x:") {
            await data.set(`${message.guild.id}.creation`, 'off')
            return;
        }
        if (await data.get(`${message.guild.id}.creation`) === 'off') {
            return;
        }
        if (creationIsRequiredServer === "oui") {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIMessage).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send({ embeds: [embed] })
            answered = false
            while (answered === false) {
                let filter = m => m.author.id === message.author.id
                await message.channel.awaitMessages({
                    filter,
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
                        creationRequiredServer = ":x:"
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send({ embeds: [embed] })
                        return msg.delete();
                    }
                    var guild = await client.shard.broadcastEval((cl, context) => {
                        let guild = cl.guilds.cache.get(context.guildID);
                        if (!guild) {
                            return undefined;
                        }
                        return guild;
                    }, { context: { "guildID": mess } })
                    var completeList = []
                    for (let i = 0; i < guild.length; i++) {
                        if (guild[i]) {
                            completeList.push(guild[i])
                        }
                    }
                    let rightServer = completeList.find(x => x.id === mess)
                    if (!rightServer) {
                        creationRequiredServer = ":x:"
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send({ embeds: [embed] })
                        return;
                    } else {
                        creationRequiredServer = rightServer.id
                        creationRequiredServerName = rightServer.name
                    }
                    if (creationRequiredRole === "oui") return;
                    var editembed;
                    if (creationIsRequiredRole === "oui") {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldRole.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredrole%").join(`<@&${creationRequiredRole}>`).split("%requiredserver%").join(creationIsRequiredServer)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    } else {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldNoRole.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredserver%").join(`${creationRequiredServerName}`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    }
                    answered = true
                    await msg.edit({ embeds: [editembed] })
                }).catch(async(err) => {
                    console.log(err)
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    await data.set(`${message.guild.id}.creation`, 'off')
                    creationRequiredServer = ":x:"
                    answered = true
                    return;
                });
            }
        }
        if (await data.get(`${message.guild.id}.creation`) === "off") return;
        if (creationIsRequiredServer === "oui") {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerInvite).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send({ embeds: [embed] })
            answered = false
            while (answered === false) {
                let filter = m => m.author.id === message.author.id
                await message.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 60000
                }).then(async collected => {
                    if (!collected.first()) return;
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
                        creationRequiredServerInvite = ":x:"
                        await data.set(`${message.guild.id}.creation`, 'off')
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send({ embeds: [embed] })
                        return msg.delete();
                    }
                    if (mess === "none") {

                        let invite = await client.shard.broadcastEval(async(cl, context) => {
                            let guild = cl.guilds.cache.get(context.guildID);
                            if (!guild) {
                                return undefined;
                            }
                            var chx = guild.channels.cache.filter(chx => chx.type === "GUILD_TEXT").find(x => x.position === 0);
                            if (!chx) {
                                return undefined;
                            }
                            let invite = await chx.createInvite({
                                temporary: false,
                                maxAge: 0
                            })

                            return invite.url;
                        }, { context: { "guildID": creationRequiredServer } })

                        invite = invite.toString().replace(",", "")
                        creationRequiredServerInvite = invite
                    } else {
                        let invites = await client.shard.broadcastEval(async(cl, context) => {
                            let guild = cl.guilds.cache.get(context.guildID);
                            if (!guild) {
                                return undefined;
                            }
                            let invites = await guild.fetchInvites()
                            if (invites.find(x => x.url === context.url)) {
                                return true;
                            }
                            return undefined;
                        }, { context: { "guildID": creationRequiredServer, "url": mess } })

                        invites = invites.toString().replace(",", "")
                        if (!invites) {
                            creationRequiredServerInvite = ":x:"
                            await data.set(`${message.guild.id}.creation`, 'off')
                            answered = true
                            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerInviteNotInServer.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                            message.channel.send({ embeds: [embed] })
                            return;
                        } else {
                            creationRequiredServerInvite = mess
                        }
                    }
                    if (creationRequiredServerInvite === ":x:") return;
                    var editembed;
                    if (creationRequiredRole === "oui") {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldRole.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredrole%").join(`<@&${creationRequiredRole}>`).split("%requiredserver%").join(creationIsRequiredServer)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    } else {
                        editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldNoRole.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredserver%").join(`${creationRequiredServerName}`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    }
                    answered = true
                    await msg.edit({ embeds: [editembed] })
                }).catch(async(err) => {
                    console.log(err)
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send({ embeds: [embed] })
                    await data.set(`${message.guild.id}.creation`, 'off')
                    creationRequiredServer = ":x:"
                    answered = true
                    return;
                });
            }
        }
        msg.delete()
    })
    if (creationChannel === ':x:' || creationTime === ':x:' || creationWinner === ':x:' || creationPrice === ':x:') {
        await data.set(`${message.guild.id}.creation`, 'off')
        return;
    }
    if (data.get(`${message.guild.id}.creation`) === 'off') {
        return;
    }
    let editedembed;
    let Isrequiredrole;
    let requiredrole;
    if (creationIsRequiredRole === 'oui') {
        Isrequiredrole = true
        requiredrole = creationRequiredRole
    } else {
        Isrequiredrole = false
        requiredrole = null
    }
    let role_activation;
    if (creationIsRequiredRole === "oui") {
        role_activation = lang.activated
    } else if (creationIsRequiredRole === "non") {
        role_activation = lang.desactivated
    }
    let server_activation;
    if (creationIsRequiredServer === "oui") {
        server_activation = lang.activated
    } else if (creationIsRequiredServer === "non") {
        server_activation = lang.desactivated
    }
    editedembed = new Discord.MessageEmbed().setTitle(`TADAA`).setDescription(lang.createConfirmHeader.split("%what%").join(client.what)).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createConfirmField.split("%channel%").join(`<#${creationChannel}>`).split("%duration%").join(creationTime).split("%winners%").join(creationWinner).split("%prize%").join(creationPrice).split("%requiredrole%").join(role_activation).split("%requiredserver%").join(server_activation)).setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL())
    let isrequiredserver;
    let requiredserver;
    let requiredservername;
    let requiredserverinvite;
    if (creationIsRequiredServer === 'oui') {
        isrequiredserver = true;
        requiredserver = creationRequiredServer;
        requiredservername = creationRequiredServerName;
        requiredserverinvite = creationRequiredServerInvite || undefined;
    } else {
        isrequiredserver = false;
        requiredserver = null;
        requiredservername = null;
        requiredserverinvite = null;
    }
    message.channel.send({ embeds: [editedembed] }).then(async msg2 => {
        await msg2.react('✅');
        await msg2.react('❌');
        const filter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        await msg2.awaitReactions({
            filter,
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
                manager.start(message.guild.channels.cache.get(`${creationChannel}`), {
                    time: ms(`${creationTime}`),
                    prize: `${creationPrice}`,
                    winnerCount: parseInt(`${creationWinner}`),
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
                }).then(async(gData) => {
                    console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
                    embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createConfirmSuccess.split("%okay%").join(client.okay).split("%channel%").join(`<#${creationChannel}>`)).setFooter(lang.footer.split("%version%").join(json.version))
                    await message.channel.send({ embeds: [embed] })
                    await data.set(`${message.guild.id}.channel`, `:x:`)
                    const stats = new db.table("stats")
                    if (!await stats.get("creation_count")) {
                        await stats.set("creation_count", 0)
                    }
                    await stats.add(`creation_count`, 1)
                }).catch(async(err) => {
                    console.error(err)
                });
            } else {
                msg2.delete()
                await data.set(`${message.guild.id}.creation`, `off`)
            }
        }).catch(() => {
            embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [embed] })
            return;
        });
    })
}
module.exports.help = {
    name: "create"
}