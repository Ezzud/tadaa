'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

module.exports.run = async (client, pf, message, args, manager,json,lang) => {
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 1); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
    if (message.guild.member(message.author).hasPermission(32) === false) {
        let role = message.guild.member(message.author).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    let opembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationActive.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.member(client.user).hasPermission(379968)) return (message.channel.send(permembed));
    if (await database.get(`data.creation`).value() === 'on') return (message.channel.send(opembed));
    await database.set(`data.creation`, 'on').write()
    await database.set(`data.channel`, 'Erreur!').write()
    await database.set(`data.time`, 'Erreur!').write()
    await database.set(`data.winnerstr`, 'Erreur!').write()
    await database.set(`data.price`, 'Erreur!').write()
    await database.set(`data.isrequiredrole`, 'Erreur!').write()
    await database.set(`data.requiredrole`, 'Erreur!').write()
    await database.set(`data.isrequiredserver`, 'Erreur!').write()
    await database.set(`data.requiredserver`, 'Erreur!').write()
    await database.set(`data.requiredservername`, 'Erreur!').write()
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
                    await database.set(`data.channel`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
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
                    await database.set(`data.channel`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    if (channel.type !== 'text') {
                        await database.set(`data.channel`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createChannelTextError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        return message.channel.send(embed);
                    }
                    await database.set(`data.channel`, channel.id).write()
                    let new_channel = `<#${await database.get(`data.channel`).value()}>`
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createEmbedFieldChannel.split("%new_channel%").join(new_channel)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    await msg.edit(editembed)
                    answered = true
                }
            }).catch(async (err) => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await database.set(`data.creation`, 'off').write()
                await database.set(`data.channel`, 'Erreur!').write()
                console.log(err)
                answered = true
                return;
            });
        }
        if (database.get(`data.channel`).value() === 'Erreur!') {
            await database.set(`data.creation`, 'off').write()
            return;
        }
        if (!message.guild.channels.cache.get(database.get(`data.channel`).value()).memberPermissions(message.guild.member(client.user)).has(379968)) {
            message.channel.send(lang.createChannelPermissionWarning)
        }
        if (database.get(`data.creation`).value() === 'off') {
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
                    await database.set(`data.time`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                let timems = ms(mess)
                if (!timems) {
                    await database.set(`data.time`, 'Erreur!').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createDurationError.splice("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    mess = mess.replace(/-/g, '')
                    await database.set(`data.time`, mess).write()
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createDurationField.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value())).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    await msg.edit(editembed)
                    answered = true
                }
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await database.set(`data.creation`, 'off').write()
                await database.set(`data.time`, 'Erreur!').write()
                answered = true
                return;
            });
        }
        if (database.get(`data.time`).value() === 'Erreur!') {
            await database.set(`data.creation`, 'off').write()
            return;
        }
        if (database.get(`data.creation`).value() === 'off') {
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
                    await database.set(`data.winnerstr`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                mess = mess.replace(/-/g, '')
                mess = parseInt(mess)
                mess = mess.toString()
                if (mess === 'NaN') {
                    await database.set('winnerstr', 'Erreur!').write()
                    await database.set('creation', 'Erreur!').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createWinnersError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    parseInt(mess)
                    Math.trunc(mess);
                    await database.set(`data.winnerint`, mess).write()
                    await database.set(`data.winnerstr`, mess.toString()).write()
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createWinnersField.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()) ).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit(editembed)
                }
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await database.set(`data.creation`, 'off').write()
                await database.set(`data.winnerstr`, 'Erreur!').write()
                answered = true
                return;
            });
        }
        if (database.get(`data.winnerstr`).value() === 'Erreur!') {
            await database.set(`data.creation`, 'off').write()
            return;
        }
        if (database.get(`data.creation`).value() === 'off') {
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
                    await database.set(`data.price`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    answered = true
                    return msg.delete();
                }
                if (mess.lenght > 100) {
                    await database.set(`data.price`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createPrizeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                } else {
                    await database.set(`data.price`, mess).write()
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createPrizeField.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit(editembed)
                }
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await database.set(`data.creation`, 'off').write()
                await database.set(`data.price`, 'Erreur!').write()
                answered = true
                return;
            });
        }
        if (database.get(`data.price`).value() === 'Erreur!') {
            await database.set(`data.creation`, 'off').write()
            return;
        }
        if (database.get(`data.creation`).value() === 'off') {
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
                    await database.set(`data.isrequiredrole`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return msg.delete();
                }
                mess = mess.toLowerCase();
                if (mess !== "oui" && mess !== "non" && mess !== "no" && mess !== "yes") {
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.isrequiredrole`, 'Erreur!').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleAError.splice("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                }
                if(mess === "yes") {
                    mess = "oui"
                }
                if(mess === "no") {
                    mess = "non"
                }
                await database.set(`data.isrequiredrole`, mess).write()
                await database.set(`data.requiredrole`, mess).write()
                var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createRoleAField.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredrole%").join(await database.get(`data.isrequiredrole`).value())).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                answered = true
                await msg.edit(editembed)
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await database.set(`data.creation`, 'off').write()
                await database.set(`data.isrequiredrole`, 'Erreur!').write()
                answered = true
                return;
            });
        }
        if (database.get(`data.isrequiredrole`).value() === 'Erreur!') {
            await database.set(`data.creation`, 'off').write()
            return;
        }
        if (database.get(`data.creation`).value() === 'off') {
            return;
        }
        if (await database.get(`data.isrequiredrole`).value() === 'oui') {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMMessage).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send(embed)
            answered = false
            while (answered === false) {
                await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000
                }).then(async collected => {
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
                        await database.set(`data.requiredrole`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
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
                        await database.set(`data.requiredrole`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createRoleMError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return;
                    } else {
                        await database.set(`data.requiredrole`, role.id).write()
                    }
                    if (await database.get(`data.requiredrole`).value() === 'Erreur!') return;
                    var editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createRoleMField.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredrole%").join(`<@&${await database.get(`data.requiredrole`).value()}>`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    answered = true
                    await msg.edit(editembed)
                }).catch(async () => {
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.requiredrole`, 'Erreur!').write()
                    answered = true
                    return;
                });
            }
        }
            if (database.get(`data.requiredrole`).value() === 'Erreur!') {
                await database.set(`data.creation`, 'off').write()
                return;
            }

        if (database.get(`data.creation`).value() === 'off') {
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
                    await database.set(`data.isrequiredserver`, 'Erreur!').write()
                    await database.set(`data.creation`, 'off').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return msg.delete();
                }
                mess = mess.toLowerCase();
                if (mess !== "oui" && mess !== "non" && mess !== "yes" && mess !== "no") {
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.isrequiredserver`, 'Erreur!').write()
                    answered = true
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerError.split("%nope%").join("client.nope")).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    return;
                }
                if(mess === "yes") {
                    mess = "oui"
                }
                if(mess === "no") {
                    mess = "non"
                }
                await database.set(`data.isrequiredserver`, mess).write()
                var editembed;
                if(await database.get(`data.isrequiredrole`).value() === "oui") {
                editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerFieldRole.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredrole%").join(`<@&${await database.get(`data.requiredrole`).value()}>`).split("%requiredserver%").join(await database.get(`data.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                } else {
                editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerFieldNoRole.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredserver%").join(await database.get(`data.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                }
                answered = true
                await msg.edit(editembed)
            }).catch(async () => {
                embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                await database.set(`data.creation`, 'off').write()
                await database.set(`data.isrequiredserver`, 'Erreur!').write()
                answered = true
                return;
            });
        }
        if (database.get(`data.isrequiredserver`).value() === 'Erreur!') {
            await database.set(`data.creation`, 'off').write()
            return;
        }
        if (database.get(`data.creation`).value() === 'off') {
            return;
        }
        if (await database.get(`data.isrequiredserver`).value() === 'oui') {
            embed = new Discord.MessageEmbed().setColor('F58F1C').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIMessage).setFooter(lang.footer.split("%version%").join(json.version))
            await message.channel.send(embed)
            answered = false
            while (answered === false) {
                await message.channel.awaitMessages(async m => m.author.id === message.author.id, {
                    max: 1,
                    time: 60000
                }).then(async collected => {
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
                        await database.set(`data.requiredserver`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return msg.delete();
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('@&', '')
                    mess = mess.replace(' ', '')
                    let role = client.guilds.cache.get(mess)
                    if (!role) {
                        await database.set(`data.requiredserver`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                        embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createServerIError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        message.channel.send(embed)
                        return;
                    } else {
                        await database.set(`data.requiredserver`, role.id).write()
                        await database.set(`data.requiredservername`, role.name).write()
                    }
                    if (await database.get(`data.requiredrole`).value() === 'Erreur!') return;
                    var editembed;
                    if(await database.get(`data.isrequiredrole`).value() === "oui") {
                    editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldRole.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredrole%").join(`<@&${await database.get(`data.requiredrole`).value()}>`).split("%requiredserver%").join(await database.get(`data.isrequiredserver`))).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    } else {
                    editembed = new Discord.MessageEmbed().setTitle(`TADAA`).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).setDescription(lang.createEmbedHeader.split("%info%").join(client.info)).addField(lang.createEmbedFieldTitle, lang.createServerIFieldNoRole.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredserver%").join(`${client.guilds.cache.get(await database.get(`data.requiredserver`)).name}`)).setFooter(`${lang.createFooter} | ${lang.footer.split("%version%").join(json.version)}`, message.author.avatarURL())
                    }
                    answered = true
                    await msg.edit(editembed)
                }).catch(async (err) => {
                    console.log(err)
                    embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createTimeError.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                    message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.requiredserver`, 'Erreur!').write()
                    answered = true
                    return;
                });
            }
      }  

            msg.delete()
    })
    if (database.get(`data.channel`).value() === 'Erreur!' || database.get(`data.time`).value() === 'Erreur!' || database.get(`data.winnerstr`).value() === 'Erreur!' || database.get(`data.price`).value() === 'Erreur!') {
        await database.set(`data.creation`, 'off').write()
        return;
    }
    if (database.get(`data.creation`).value() === 'off') {
        return;
    }
    let editedembed;
    let Isrequiredrole;
    let requiredrole;
    if (await database.get(`data.isrequiredrole`).value() === 'oui') {
        Isrequiredrole = true
        requiredrole = database.get(`data.requiredrole`).value()
    } else {
        Isrequiredrole = false
        requiredrole = null
    }
    editedembed = new Discord.MessageEmbed().setTitle(`TADAA`).setDescription(lang.createConfirmHeader.split("%what%").join(client.what)).setThumbnail(client.user.avatarURL()).setColor(`#FA921D`).addField(lang.createEmbedFieldTitle, lang.createConfirmField.split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`).split("%duration%").join(await database.get(`data.time`).value()).split("%winners%").join(await database.get(`data.winnerstr`).value()).split("%prize%").join(await database.get(`data.price`)).split("%requiredrole%").join(await database.get(`data.isrequiredrole`).value()).split("%requiredserver%").join(await database.get(`data.isrequiredserver`))).setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL())
    let isrequiredserver;
    let requiredserver;
    let requiredservername;
    if(await database.get(`data.isrequiredserver`).value() === 'oui') {
        isrequiredserver = true;
        requiredserver = await database.get(`data.requiredserver`).value()
        requiredservername = await database.get(`data.requiredservername`).value()
    } else {
        isrequiredserver = false;
        requiredserver = null
        requiredservername = null  
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
                    await database.set(`data.creation`, `off`).write()
                    manager.start(message.guild.channels.cache.get(`${database.get(`data.channel`).value()}`), {
                        time: ms(`${database.get(`data.time`).value()}`),
                        prize: `${database.get(`data.price`).value()}`,
                        winnerCount: parseInt(`${database.get(`data.winnerstr`).value()}`),
                        IsRequiredRole: Isrequiredrole,
                        requiredRole: requiredrole,
                        IsRequiredServer: isrequiredserver,
                        requiredServer: requiredserver,
                        lang: lang.id,
                        requiredServerName: requiredservername
                    }).then(async (gData) => {
                        console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`);
                        embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createConfirmSuccess.split("%okay%").join(client.okay).split("%channel%").join(`<#${await database.get(`data.channel`).value()}>`)).setFooter(lang.footer.split("%version%").join(json.version))
                        await message.channel.send(embed)
                        await database.set(`data.channel`, `Erreur!`).write()
                        await database.set(`data.time`, `Erreur!`).write()
                        await database.set(`data.winnerstr`, `Erreur!`).write()
                        await database.set(`data.price`, `Erreur!`).write()
                    }).catch(async (err) => {
                        console.error(err)
                    });
                } else {
                    msg2.delete()
                    await database.set(`data.channel`, `Erreur!`).write()
                    await database.set(`data.time`, `Erreur!`).write()
                    await database.set(`data.winnerstr`, `Erreur!`).write()
                    await database.set(`data.price`, `Erreur!`).write()
                    await database.set(`data.creation`, `off`).write()
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