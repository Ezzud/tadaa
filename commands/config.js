'use strict';
const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const db = require('quick.db')

module.exports.run = async (client, pf, message, args, manager,json,lang) => {

    var data = new db.table("serverInfo")
    let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(`${client.nope} ${lang.YouHaveNoPermission}`).setFooter(lang.footer.split("%version%").join(json.version))
    if (!message.guild.member(message.author).hasPermission(8)) return (message.channel.send(embed));
    if (!args[0]) {
        let dmWin = await data.get(`${message.guild.id}.isDMWin`)
        if (!dmWin) {
            dmWin = true
            await data.set(`${message.guild.id}.isDMWin`, true)
        }
        let rainbow = await data.get(`${message.guild.id}.rainbow`)
        if(!rainbow) {
           rainbow = false
           await data.set(`${message.guild.id}.rainbow`, false) 
        }
        let rainbowm;
        if (rainbow === true) {
            rainbowm = lang.activated
        } else if (rainbow === false) {
            rainbowm = lang.desactivated
        } else {
            rainbowm = `?`
        }



        let dmWinm;
        if (dmWin === true) {
            dmWinm = lang.activated
        } else if (dwWin === false) {
            dmWinm = lang.desactivated
        } else {
            dmWinm = `?`
        }


        let embed = new Discord.MessageEmbed().setAuthor(`Configuration`, message.guild.iconURL()).setThumbnail(client.user.avatarURL()).setDescription(`-> ${message.guild.name}`).setColor(`#5ED5F5`).addField(lang.configEmbedValues.split("%info%").join(client.info), lang.configEmbedField.split("%pf%").join(pf).split("%dmWinm%").join(dmWinm).split("%lang%").join(lang.name).split("%rainbowm%").join(rainbowm)).addField(lang.configEmbedChange.split("%what%").join(client.what), lang.configEmbedChangeField.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version), message.author.avatarURL()).setTimestamp()
        message.channel.send(embed)
    }
    if (!args[0]) return;
    if (args[0] === 'prefix') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configNoPrefixDesc.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configPrefixSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if (args[1] === await data.get(`${message.guild.id}.prefix`)) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configPrefixSame.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configPrefixSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if(args[1].length > 3) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configPrefixLong.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configPrefixSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        await data.set(`${message.guild.id}.prefix`, args[1])
        let new_prefix = await data.get(`${message.guild.id}.prefix`)
        let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configPrefixSuccess.split("%okay%").join(client.okay).split("%new_prefix%").join(new_prefix)).setFooter(lang.footer.split("%version%").join(json.version))
        message.channel.send(embed)
    } else if (args[0].toLowerCase() === 'dmwin') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinNoValue.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if (args[1].toLowerCase() === 'oui' || args[1].toLowerCase() === 'yes') {
            if (await data.get(`${message.guild.id}.isDMWin`) === true) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(configDMWinAlreadyActivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                return;
            }
            await data.set(`${message.guild.id}.isDMWin`, true)
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinActivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        } else if (args[1].toLowerCase() === 'non' || args[1].toLowerCase() === 'no') {
            if (await data.get(`${message.guild.id}.isDMWin`) === false) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinAlreadyDesactivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                return;
            }
            await data.set(`${message.guild.id}.isDMWin`, false)
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configDMWinDesactivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(lang.configPrefixSyntaxTitle, lang.configDMWinSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        }


    } else if (args[0].toLowerCase() === 'rainbow') {
        if (!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowNoValue.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configRainbowSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;
        }
        if (args[1].toLowerCase() === 'oui' || args[1].toLowerCase() === 'yes') {
            if (await data.get(`${message.guild.id}.rainbow`) === true) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(ConfigRainbowAlreadyActivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configRainbowSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                return;
            }
            await data.set(`${message.guild.id}.rainbow`, true)
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowActivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        } else if (args[1].toLowerCase() === 'non' || args[1].toLowerCase() === 'no') {
            if (await data.get(`${message.guild.id}.rainbow`) === false) {
                let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowAlreadyDesactivated.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configRainbowSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
                message.channel.send(embed)
                return;
            }
            await data.set(`${message.guild.id}.rainbow`, false)
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configRainbowDesactivated.split("%okay%").join(client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).addField(lang.configPrefixSyntaxTitle, lang.configRainbowSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
        }






    } else if(args[0].toLowerCase() === 'lang') {
        client.langs = new Discord.Collection();
        if(!args[1]) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangNoValue.split("%nope%").join(client.nope)).addField(lang.configPrefixSyntaxTitle, lang.configLangSyntax.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;            
        }
        if(args[1] === "list") {
            let embed = new Discord.MessageEmbed().setColor(`#5ED5F5`).setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangList.split("%pf%").join(pf)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;         
        } else {
    await fs.readdir("./lang/",async (err, files) => {
        if (err) console.log(err);
        let jsfile = files.filter(f => f.split(".").pop() === "json");
        if (jsfile.length <= 0) {
            console.log("Aucun fichier trouvé dans ./lang/");
            return;
        }
        jsfile.forEach(async (f, i) => {
            let props = require(`../lang/${f}`);
            client.langs.set(f.split(".json").join(""), props);
        });
        let lang_file = client.langs.get(args[1]);
        if(lang_file) {
            if(lang_file.id === await data.get(`${message.guild.id}.lang`)) {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangSame.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;              
            }
            await data.set(`${message.guild.id}.lang`, lang_file.id)
            let embed = new Discord.MessageEmbed().setColor('24E921').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangSuccess.split("%lang%").join(lang_file.name)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return; 
        } else {
            let embed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.configLangUnknown.split("%nope%").join(client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
            message.channel.send(embed)
            return;  
        }
    });
}
    }


}
module.exports.help = {
    name: "config"
}