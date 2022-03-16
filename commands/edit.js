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
    moment.locale(lang.moment)
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

    let valueToChange = message.options.getString("value")
    switch(valueToChange) {
        case "winners":
            let mess = message.options.getString("new_value")
            mess = mess.replace(/-/g, '')
            mess = parseInt(mess)
            mess = mess.toString()
            if (mess === 'NaN') {
                let nueembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editNoWinnerNumber.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return message.reply({ embeds: [nueeembed]});
            } else {
                mess = parseInt(mess)
                mess = Math.trunc(mess);
                let options = []
            let onServer;
            onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
            onServer = onServer.filter((g) => g.ended !== true);

            for(let i = 0; i < onServer.length; i++) {
                let value = onServer[i];
                options.push({
                    label: `${value.prize}`,
                    description: `ID: ${value.messageID} | ${lang.pleaseEnd} ${moment(value.endAt).fromNow()} `,
                    value: `w|${mess}|${value.messageID}`
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
                    .setCustomId('edit_id')
                    .setPlaceholder(lang.pleaseChoose)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(options),
            );
        
            message.reply({ content:lang.pleaseChoose ,components: [row], ephemeral: true})

            }
            
            break;
        case "prize":

            let prix = message.options.getString("new_value")
            if(prix.length > 75) {
                let longembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editPriceTooLong.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                return message.reply({ embeds: [longembed]});            
            }
            let options = []
            let onServer;
            onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
            onServer = onServer.filter((g) => g.ended !== true);

            for(let i = 0; i < onServer.length; i++) {
                let value = onServer[i];
                options.push({
                    label: `🎁 ${value.prize}`,
                    description: `ID: ${value.messageID} | ${lang.pleaseEnd} ${moment(value.endAt).fromNow()} `,
                    value: `p|${prix}|${value.messageID}`
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
                    .setCustomId('edit_id')
                    .setPlaceholder(lang.pleaseChoose)
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(options),
            );
        
            message.reply({ content:lang.pleaseChoose || "Please choose a giveaway" ,components: [row], ephemeral: true})

            break;
    }

}
module.exports.help = {
    name: "edit"
}