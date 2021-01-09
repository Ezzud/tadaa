'use strict';
const Discord = require("discord.js");
module.exports.run = async (client, pf, message, args, manager,json,lang) => {
    var embed = new Discord.MessageEmbed()
    .setTitle(`TADAA ${client.what}`)
    .setColor('#43FA31')
    .setThumbnail(client.user.avatarURL())
    .addField(lang.helpGiveawayFieldTitle, `${lang.helpGiveawayPermission.split("%warning%").join(client.warning)}\n\n${lang.helpGiveawayCreate.split("%pf%").join(pf)}\n${lang.helpGiveawayStart.split("%pf%").join(pf)}\n${lang.helpGiveawayEnd.split("%pf%").join(pf)}\n${lang.helpGiveawayReroll.split("%pf%").join(pf)}\n${lang.helpGiveawayDelete.split("%pf%").join(pf)}\n${lang.helpGiveawayEdit.split("%pf%").join(pf)}\n${lang.helpGiveawayList.split("%pf%").join(pf)}\n\u200B`)
    .addField(lang.helpConfigFieldTitle, `${lang.helpConfigPermission.split("%warning%").join(client.warning)}\n\n${lang.helpConfigList.split("%pf%").join(pf)}\n${lang.helpConfigPrefix.split("%pf%").join(pf)}\n${lang.helpConfigDMWin.split("%pf%").join(pf)}\n\u200B`)
    .addField(lang.helpInfoFieldTitle, `${lang.helpInfoList.split("%pf%").join(pf)}\n${lang.helpInfoHelp.split("%pf%").join(pf)}\n${lang.helpInfoPing.split("%pf%").join(pf)}`)
    .setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL())
    message.channel.send(embed)
}
module.exports.help = {
    name: "help"
}