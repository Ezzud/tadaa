'use strict';
const Discord = require("discord.js");
module.exports.run = async (client, pf, message, manager,json,lang) => {
    var embed = new Discord.MessageEmbed()
    .setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`)
    .setColor("#33E210").addField(`\u200B`, lang.inviteText)
    .setFooter(lang.footer.split("%version%").join(json.version))
    .addField(lang.inviteTitle, lang.inviteYesField.split("%okay%").join(client.okay), true)
    .addField("\n\u200B", lang.inviteNoField.split("%nope%").join(client.nope), true)
    message.reply({ embeds: [embed]})
}
module.exports.help = {
    name: "invite"
}