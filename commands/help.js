'use strict';
const Discord = require("discord.js");
module.exports.run = async(client, pf, message, args, manager, json, lang) => {
    var embed = new Discord.MessageEmbed()
        .setTitle(`TADAA ${client.what}`)
        .setColor('#43FA31')
        .setThumbnail(client.user.avatarURL())
        .addField(lang.helpGiveawayFieldTitle, `${lang.helpGiveawayPermission.split("%warning%").join(client.warning)}\n\n${lang.helpGiveawayCreate.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpGiveawayStart.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpGiveawayEnd.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpGiveawayReroll.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpGiveawayDelete.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpGiveawayEdit.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpGiveawayList.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n\u200B`)
        .addField(lang.helpConfigFieldTitle, `${lang.helpConfigPermission.split("%warning%").join(client.warning)}\n\n${lang.helpConfigList.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpConfigPrefix.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpConfigDMWin.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpConfigLang.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpConfigLangList.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n\u200B`)
        .addField(lang.helpInfoFieldTitle, `${lang.helpInfoList.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpInfoHelp.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpInfoStats.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpInfoPing.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpInfoVote.split("%pf%").join(pf).split("%emoji%").join(client.online)}\n${lang.helpInfoInvite.split("%pf%").join(pf).split("%emoji%").join(client.online)}`)
        .setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL())
    let buttonArray = []
    let inviteButton = new Discord.MessageButton().setLabel("Invite").setStyle("LINK").setURL("https://discord.com/oauth2/authorize?client_id=732003715426287676&permissions=388193&scope=bot").toJSON()
    let websiteButton = new Discord.MessageButton().setLabel("Upvote").setStyle("LINK").setURL("https://top.gg/bot/732003715426287676").toJSON()
    let supportButton = new Discord.MessageButton().setLabel("Support").setStyle("LINK").setURL("https://discord.gg/ezzud").toJSON()

    buttonArray.push(inviteButton);
    buttonArray.push(websiteButton);
    buttonArray.push(supportButton);
    let buttons = new Discord.MessageActionRow().addComponents(buttonArray).toJSON()

    message.channel.send({ components: [buttons], embeds: [embed] });
}
module.exports.help = {
    name: "help"
}