'use strict';

/* /////////////////////////////////////////////////


        Variables


*/ /////////////////////////////////////////////////


const Discord = require("discord.js");
const Topgg = require(`@top-gg/sdk`)
const config = require('../config.json')
var api;
if (config.topggEnabled === true) {
    api = new Topgg.Api(config.topggToken)
}


/* /////////////////////////////////////////////////


        Main Code

*/ /////////////////////////////////////////////////

module.exports.run = async (client, pf, message, manager,json,lang) => {
    if (config.topggEnabled === false) return;
    const request = await api.hasVoted(message.user.id)
    let embed;
    if(request === true) {
    	embed = new Discord.MessageEmbed()
    	.setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`)
    	.setThumbnail("https://top.gg/images/dblnew.png")
    	.setColor("#F5150B").addField(`\u200B`, lang.alreadyVoted)
    	.setFooter(lang.footer.split("%version%").join(json.version))
    } else {
    	embed = new Discord.MessageEmbed()
    	.setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`)
    	.setColor("#33E210").addField(`\u200B`, lang.noVoted)
    	.setThumbnail("https://top.gg/images/dblnew.png")
    	.setFooter(lang.footer.split("%version%").join(json.version))        
    }
 message.reply({ embeds: [embed]})
}
module.exports.help = {
    name: "vote"
}