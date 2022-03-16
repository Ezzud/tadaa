'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const db = require('quick.db')

module.exports.run = async(client, pf, message, manager, json, lang) => {

    var data = new db.table("serverInfo")
    let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`:x: ${lang.YouHaveNoPermission}`).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.members.cache.get(message.user.id).permissions.has("ADMINISTRATOR")) return (message.reply({ embeds: [embed], ephemeral:true}));
    client.langs = new Discord.Collection();
    await fs.readdir("./lang/", async(err, files) => {
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "json");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./lang/");
            return;
        }
        jsfile.forEach(async(f, i) => {
            let props = require(`../lang/${f}`);
            client.langs.set(f.split(".json").join(""), props);
        });
        let lang_file = client.langs.get(message.options.getString("lang"));
        if (lang_file) {
            if (lang_file.id === await data.get(`${message.guild.id}.lang`)) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangSame.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                message.reply({ embeds: [embed] })
                return;
            }
            await data.set(`${message.guild.id}.lang`, lang_file.id)
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangSuccess.split("%lang%").join(lang_file.name)).setFooter(lang.footer.split("%version%").join(json.version))
            message.reply({ embeds: [embed] })
            return;
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.user.tag, message.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangUnknown.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.reply({ embeds: [embed] })
            return;
        }
    });

}
module.exports.help = {
    name: "setlang"
}