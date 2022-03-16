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

/* /////////////////////////////////////////////////


        Main Code


*/ /////////////////////////////////////////////////
module.exports = async (client, message) => {
    if(message.mentions.users.size < 1) return;
    if(message.mentions.users.first().id === client.user.id) {
        var embed = new Discord.MessageEmbed()
        .setAuthor(`Update!`, client.user.avatarURL())
        .setDescription(`TADAA moved to **slash commands**! Please type \`/help\` to see all commands`)
        .setColor(`#F67272`)
        .setTimestamp()
        .setFooter(`TADAA v1.5.5`, message.author.avatarURL)
        message.reply({embeds:[embed]});
    }
}