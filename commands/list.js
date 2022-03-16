'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs')
var util = require('util');
const log_stdout = process.stdout;
var path = require('path');
var commandname = path.basename(__filename);
const loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`

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

    await message.deferReply()
    let onServer;
    onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
    onServer = onServer.filter((g) => g.ended !== true);
        var list = [""]
        var firstvalue = 0
        var i = 0
        for(i in onServer) {
            if(list[firstvalue].length >= 900) {
                list[firstvalue + 1] = ""
                var giveaway = onServer[i];
                var formatedDate = giveaway.endAt.toString();
                formatedDate = formatedDate.substring(0, formatedDate.length - 3)
                formatedDate = parseInt(formatedDate)
                var msg = `:gift: ${giveaway.prize} - <t:${formatedDate}> (<t:${formatedDate}:R>) - <#${giveaway.channelID}>`
                list[firstvalue + 1] = `${list[firstvalue + 1]}${msg}\n`
                firstvalue++
                i++
            } else {
                var giveaway = onServer[i];
                var formatedDate = giveaway.endAt.toString();
                formatedDate = formatedDate.substring(0, formatedDate.length - 3)
                formatedDate = parseInt(formatedDate)
                var msg = `:gift: ${giveaway.prize} - <t:${formatedDate}> (<t:${formatedDate}:R>) - <#${giveaway.channelID}>`
                list[firstvalue] = `${list[firstvalue]}${msg}\n`
                i++               
            }

        }
    var embed = new Discord.MessageEmbed()
    .setAuthor(lang.listEmbedTitle, client.user.avatarURL())
    .setColor(`#2ADAEF`)
    var listing = 0;
    if(onServer.length < 1) {
        embed.addField(`\u200B`, list[listing] || lang.listEmbedNoGiveaway);
    } else {
        for(listing in list) {
            if(listing === 0) {
                embed.addField(`\u200B`, list[listing] || lang.listEmbedNoGiveaway);
            } else {
                embed.addField(`\u200B`, list[listing] || `\u200B`);
            }
            
            listing++;
        }
    }
    
    embed.addField(lang.listEmbedInfoTitle, lang.listEmbedInfoField)
    .setFooter(lang.footer.split("%version%").join(json.version), message.user.avatarURL())
    .setTimestamp()
    await message.editReply({embeds: [embed]})
}
module.exports.help = {
    name: "list"
}