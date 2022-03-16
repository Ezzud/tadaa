'use strict';

/* /////////////////////////////////////////////////


        Variables


*/ /////////////////////////////////////////////////

const { MessageActionRow, MessageSelectMenu } = require('discord.js');
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


module.exports.run = async (client, pf, message, manager,json,lang) => {
console.log = function(d) {
    let date = new Date();
    date.setHours(date.getHours() + 2); //
    fs.appendFileSync(`${client.logs_path}`, `\n(${commandname}) ${moment(date).format('MM-D-YYYY hh:mm')} | ${d}`, "UTF-8",{'flags': 'a+'});
    log_stdout.write(`SHARD #${client.shard.ids[0]} ` + util.format(d) + '\n');
};
    if (message.guild.members.cache.get(message.user.id).permissions.has("MANAGE_GUILD") === false) {
        let role = message.guild.members.cache.get(message.user.id).roles.cache.find(x => x.name === "Giveaways")
        if (role === undefined || role === false || role === null) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNoPermission.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.reply({ embeds: [embed], ephemeral:true })
            return;
        }
    
    }

    let options = []
    let onServer;
    onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    onServer = onServer.filter((g) => g.ended === true);
    onServer.reverse()
    onServer = onServer.slice(0, 24)

    for(let i = 0; i < onServer.length; i++) {
        let value = onServer[i];
        options.push({
            label: `🎁 ${value.prize}`,
            description: `ID: ${value.messageID} | ${lang.pleaseStart} ${moment(value.startAt).fromNow()} `,
            value: `${value.messageID}`
        })  
    }

    options.push({
        label: lang.pleaseCancelTitle,
        description: lang.pleaseCancel,
        value: `cancel`
    })
    


    const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .setCustomId('reroll_id')
            .setPlaceholder(lang.pleaseChoose)
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(options),
    );

    message.reply({ content:lang.pleaseChoose || "Please choose a giveaway" ,components: [row], ephemeral: true})

    /*
    manager.reroll(args[0]).then(() => {
        message.react('✅');
        let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.rerollEmbedSuccess.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send({ embeds: [yembed]})
    }).catch((err) => {
        if (err === "GiveawayNotFound") {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        } else if (err === "GiveawayUnknownChannel") {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        } else if (err === "GiveawayNotEnded") {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNotEnded.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        } else {
            message.react('❌');
            let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send({ embeds: [noembed]})
        }
    });
    */
}
module.exports.help = {
    name: "reroll"
}