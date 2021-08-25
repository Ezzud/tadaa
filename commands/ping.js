'use strict';
const Discord = require("discord.js");
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
module.exports.run = async (client, pf, message, args, manager, json, lang) => {
    console.log = function(d) {
        let date = new Date();
        date.setHours(date.getHours() + 2); //
        fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8", {
            'flags': 'a+'
        });
        log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
    };
    var messagePing = new Date().getTime() - message.createdTimestamp
    var apiPing = Math.trunc(client.ws.ping)
    let color;
    if (apiPing + messagePing > 800) {
        color = ':red_circle: '
    } else if (apiPing + messagePing > 400) {
        color = ':orange_circle: '
    } else {
        color = ':green_circle:'
    }
    // let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('17F0C9').addField(`\u200B`, lang.pingStart).setFooter(lang.footer.split("%version%").join(json.version))
    message.channel.send(lang.pingEnd.split("%messagePing%").join(messagePing).split("%apiPing%").join(apiPing).split("%color%").join(color))
    /* message.channel.send(lang.pingStart).then(msg => {

         let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor(color).addField(`\u200B`, lang.pingEnd.split("%messagePing%").join(messagePing).split("%apiPing%").join(apiPing)).setFooter(lang.footer.split("%version%").join(json.version))

         msg.edit(lang.pingEnd.split("%messagePing%").join(messagePing).split("%apiPing%").join(apiPing).split("%color%").join(color))
     
     })*/
}
module.exports.help = {
    name: "ping"
}