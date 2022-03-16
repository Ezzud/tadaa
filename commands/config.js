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
    
        let dmWin = await data.get(`${message.guild.id}.isDMWin`)
        if (!dmWin) {
            dmWin = true
            await data.set(`${message.guild.id}.isDMWin`, true)
        }
        let rainbow = await data.get(`${message.guild.id}.rainbow`)
        if (!rainbow) {
            rainbow = false
            await data.set(`${message.guild.id}.rainbow`, false)
        }
        let rainbowm;
        if (rainbow === true) {
            rainbowm = lang.activated
        } else if (rainbow === false) {
            rainbowm = lang.desactivated
        } else {
            rainbowm = `?`
        }



        let dmWinm;
        if (dmWin === true) {
            dmWinm = lang.activated
        } else if (dwWin === false) {
            dmWinm = lang.desactivated
        } else {
            dmWinm = `?`
        }


        embed = new Discord.MessageEmbed().setAuthor(`Configuration`, message.guild.iconURL()).setThumbnail(client.user.avatarURL()).setDescription(`-> ${message.guild.name}`).setColor(`#5ED5F5`).addField(lang.configEmbedValues.split("%info%").join(client.info), lang.configEmbedField.split("%pf%").join(pf).split("%dmWinm%").join(dmWinm).split("%lang%").join(lang.name).split("%rainbowm%").join(rainbowm)).addField(lang.configEmbedChange.split("%what%").join(client.what), lang.configEmbedChangeField.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version), message.user.avatarURL()).setTimestamp()
        message.reply({ embeds: [embed] })

}
module.exports.help = {
    name: "config"
}