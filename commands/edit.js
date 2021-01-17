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
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    if (message.guild.member(message.author).hasPermission(32) === false) {
        let role = message.guild.member(message.author).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.member(client.user).hasPermission(19456)) return (message.channel.send(permembed));
    if (!args[0]) {
        let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(embed)
        return;
    }
    if (!args[1]) {
        let nembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoOption.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(nembed)
        return;
    }
    if (args[1] === 'gagnants') {
        if (!args[2]) {
            let nuembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoWinnerArg.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(nuembed)
            return;
        }
        let mess = args[2]
        mess = mess.replace(/-/g, '')
        mess = parseInt(mess)
        mess = mess.toString()
        if (mess === 'NaN') {
            let nueembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoWinnerNumber.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return message.channel.send(nueembed);
        } else {
            parseInt(mess)
            Math.trunc(mess);
            await manager.edit(args[0], {
                newWinnerCount: mess,
                addTime: 5000
            }).then(() => {
                message.react('✅');
                let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editEmbedSuccess.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(yembed)
            }).catch((err) => {
                message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(noembed)
            });
        }
    } else if (args[1] === 'prix') {
        if (!args[2]) {
            let noaembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoPrice.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return message.channel.send(noaembed);
        }
        let prix = message.content.replace(`${pf}edit`, ``)
        prix = prix.replace(`${args[0]}`, '')
        prix = prix.replace(`prix`, '');
        prix = prix.replace(`   `, '')
        if(prix.length > 100) {
            let longembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editPriceTooLong.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return message.channel.send(longembed);            
        }
        await manager.edit(args[0], {
            newPrize: prix,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editEmbedSuccess.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(yembed)
        }).catch((err) => {
            message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(noembed)
        });
    } else {
        let noedmbed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editUnknownOption.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(noedmbed)
    }
}
module.exports.help = {
    name: "edit"
}