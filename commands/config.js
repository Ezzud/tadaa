'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');


module.exports.run = async (client, pf, message, args, manager,json,lang) => {

    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
    let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${nope} ${lang.YouHaveNoPermission}`).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.member(message.author).hasPermission(8)) return (message.channel.send(embed));
    if (!args[0]) {
        let dmWin = await database.get(`data.isDMWin`).value()
        if (!dmWin) {
            dmWin = true
            await database.set(`data.isDMWin`, true).write()
        }
        let dmWinm;
        if (dmWin === true) {
            dmWinm = lang.activated
        } else if (dwWin === false) {
            dmWinm = lang.desactivated
        } else {
            dmWinm = `?`
        }
        let embed = new Discord.MessageEmbed().setAuthor(`Configuration`, message.guild.iconURL()).setThumbnail(client.user.avatarURL()).setDescription(`-> ${message.guild.name}`).setColor(`#5ED5F5`).addField(lang.configEmbedValues.split("%info%").join(client.info), lang.configEmbedField.split("%pf%").join(pf).split("%dmWinm%").join(dmWinm)).addField(lang.configEmbedChange.split("%what%").join(client.what), lang.configEmbedChangeField.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL()).setTimestamp()
        message.channel.send(embed)
    }
    if (!args[0]) return;
    if (args[0] === 'prefix') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configNoPrefixDesc.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configPrefixSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if (args[1] === await database.get(`data.prefix`).value()) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configPrefixSame.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configPrefixSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if(args[1].length > 3) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configPrefixLong.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configPrefixSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        await database.set(`data.prefix`, args[1]).write()
        let new_prefix = await database.get(`data.prefix`).value()
        let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configPrefixSuccess.split("%okay%").join(client.okay).split("%new_prefix%").join(new_prefix)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(embed)
    } else if (args[0].toLowerCase() === 'dmwin') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinNoValue.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if (args[1].toLowerCase() === 'oui') {
            if (await database.get(`data.isDMWin`).value() === true) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(configDMWinAlreadyActivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                return;
            }
            await database.set(`data.isDMWin`, true).write()
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinActivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        } else if (args[1].toLowerCase() === 'non') {
            if (await database.get(`data.isDMWin`).value() === false) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinAlreadyDesactivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                return;
            }
            await database.set(`data.isDMWin`, false).write()
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinDesactivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        }
    }
}
module.exports.help = {
    name: "config"
}