'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const db = require('quick.db')

module.exports.run = async(client, pf, message, manager, json, lang) => {

    let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`:x: ${lang.YouHaveNoPermission}`).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.members.cache.get(message.user.id).permissions.has("ADMINISTRATOR")) return (message.reply({ embeds: [embed], ephemeral:true }));


    embed = new Discord.MessageEmbed().setColor(`#5ED5F5`).setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangList.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
    message.reply({ embeds: [embed] })
    return;

}
module.exports.help = {
    name: "languages"
}