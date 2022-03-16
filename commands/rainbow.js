'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const db = require('quick.db')

module.exports.run = async(client, pf, message, manager, json, lang) => {
    var data = new db.table("serverInfo")
    let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`:x: ${lang.YouHaveNoPermission}`).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.members.cache.get(message.user.id).permissions.has("ADMINISTRATOR")) return (message.reply({ embeds: [embed], ephemeral:true }));

    let datas = message.options.getBoolean("value")

    let rainbow = await data.get(`${message.guild.id}.rainbow`)
        if (!rainbow) {
            rainbow = false
            await data.set(`${message.guild.id}.rainbow`, false)
        }

    if (datas === true) {
        if (await data.get(`${message.guild.id}.rainbow`) === true) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowAlreadyActivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configRainbowSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.reply({ embeds: [embed] })
            return;
        }
        await data.set(`${message.guild.id}.rainbow`, true)
        let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowActivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
        message.reply({ embeds: [embed] })
    } else {
        if (await data.get(`${message.guild.id}.rainbow`) === false) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowAlreadyDesactivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configRainbowSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.reply({ embeds: [embed] })
            return;
        }
        await data.set(`${message.guild.id}.rainbow`, false)
        let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowDesactivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
        message.reply({ embeds: [embed] })
    }

}
module.exports.help = {
    name: "rainbow"
}