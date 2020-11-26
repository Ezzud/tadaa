'use strict';
const Discord = require("discord.js");
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
module.exports.run = async (client, pf, message, args, nope, info, okay, what, warning, manager, json) => {
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor('17F0C9').addField(`\u200B`, `*Pinging...*`).setFooter(`TADAA | v${json.version}`)
    await message.channel.send(embed).then(async (msg) => {
        var timer = new Date().getTime() - message.createdTimestamp
        let color;
        if (timer > 500) {
            color = 'E3260F'
        } else if (timer < 100) {
            color = '48F728'
        } else {
            color = 'E58613'
        }
        let embed = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setColor(color).addField(`\u200B`, `Pong! *${timer}ms*`).setFooter(`TADAA | v${json.version}`)
        await msg.edit(embed)
    })
}
module.exports.help = {
    name: "ping"
}