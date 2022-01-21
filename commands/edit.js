'use strict';

/* /////////////////////////////////////////////////


        Variables


*/ /////////////////////////////////////////////////



const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);




/* /////////////////////////////////////////////////


        Main Code


*/ /////////////////////////////////////////////////



module.exports.run = async (client, pf, message, args, manager,json,lang) => {
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    
    if (message.guild.members.cache.get(message.author.id).permissions.has(32) === false) {
        let role = message.guild.members.cache.get(message.author.id).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [embed]})
            return;
        }
    }
    let permembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoBotPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.member(client.user).permissions.has(379968)) return (message.channel.send(permembed));
    if (!args[0]) {
        let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send({ embeds: [embed]})
        return;
    }
    if (!args[1]) {
        let nembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoOption.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send({ embeds: [nembed]})
        return;
    }
    if (args[1] === 'gagnants' || args[1] === 'winners') {
        if (!args[2]) {
            let nuembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoWinnerArg.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [nuembed]})
            return;
        }
        let mess = args[2]
        mess = mess.replace(/-/g, '')
        mess = parseInt(mess)
        mess = mess.toString()
        if (mess === 'NaN') {
            let nueembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoWinnerNumber.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return message.channel.send({ embeds: [nueeembed]});
        } else {
            parseInt(mess)
            Math.trunc(mess);
            await manager.edit(args[0], {
                newWinnerCount: mess,
                addTime: 5000
            }).then(() => {
                message.react('✅');
                let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editEmbedSuccess.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [yembed]})
            }).catch((err) => {
                message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send({ embeds: [noembed]})
            });
        }
    } else if (args[1] === 'prix' || args[1] === 'prize') {
        if (!args[2]) {
            let noaembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoPrice.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return message.channel.send(noaembed);
        }
        let prix = message.content.replace(`${pf}edit`, ``)
        prix = prix.replace(`${args[0]}`, '')
        prix = prix.replace(`prix`, '');
        prix = prix.replace(`prize`, '');
        prix = prix.replace(`   `, '')
        if(prix.length > 100) {
            let longembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editPriceTooLong.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            return message.channel.send({ embeds: [longembed]});            
        }
        await manager.edit(args[0], {
            newPrize: prix,
            addTime: 5000
        }).then(() => {
            message.react('✅');
            let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editEmbedSuccess.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [yembed]})
        }).catch((err) => {
            message.react('❌');
        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        });
    } else {
        if (err === "GiveawayNotFound") {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        } else if (err === "GiveawayUnknownChannel") {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        } else if (err === "GiveawayAlreadyEnded") {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWAlreadyEnded.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        } else {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        }
    }
}
module.exports.help = {
    name: "edit"
}