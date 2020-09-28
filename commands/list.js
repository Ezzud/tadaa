const Discord = require("discord.js");
const ms = require('ms');
const moment = require('moment');
const fs = require('fs');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
let emojiMap = {
  link: "732605373185261629",
  dev: "732605373185261608",
  sharding: "732605372954575029",
  computer : "732607541061877760",
  memoire: "732698462822596659",
  okay: "732581317098602546",
  nope: "732581316880498782",
  info: "732581319971831808",
  what: "732581319678361662",
  warn: "732581316217929782"
  
};
const loadings = `<a:erjbgtuezrftetgfret:688433071573565440>`
  function getEmoji(name) {
  return `<:${name}:${emojiMap[name]}>`;
}
module.exports.run = async (client,pf,message,args,nope,info,okay,what,warning,manager) => {
      if(message.guild.member(message.author).hasPermission(32) === false) {
        let role = message.guild.member(message.author).roles.cache.find(x => x.name === "Giveaways")
      if(role !== undefined && role !== false && role !== null)  {
            console.log('Perms bypakdkdkkfkfdss')
        } else {
                let embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Vous n'avez pas la permission ni le rôle \`Giveaways\`*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed) 
            return;
        }
    }
                let permembed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} J'ai besoin des permissions \`Voir les salons, envoyer des messages, envoyer des liens et embed\` pour fonctionner`)
                .setFooter(`TADAA | créé par ezzud`)
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(permembed));
            let onServer;
        onServer = client.giveawaysManager.giveaways.filter((g) => g.guildID === message.guild.id);
        onServer = client.giveawaysManager.giveaways.filter((g) => g.ended !== true);
        let onServer2;
        let onServer3;
        let onServer4;
        if(!onServer) {
            onServer = 'Aucun :('
        } else {
            onServer = onServer.map(g => `Prix: \`${g.prize}\` | Fin: ${moment(g.endAt).format('LLL')}. [\[Accéder\]](https://discordapp.com/channels/${g.guildID}/${g.channelID}/${g.messageID})::`)
            onServer = Array.from(onServer)
            if(onServer[6] !== undefined && onServer[10] !== undefined) {
                onServer2 = onServer.slice(6, 10)
                onServer2 = onServer2.toString().replace(/::/g, `\n`).replace(/,/g, ``)
            } else {
                onServer2 = `\u200B`;
            }
            if(onServer[11] !== undefined && onServer[15] !== undefined) {
                onServer3 = onServer.slice(11, 15)
                onServer3 = onServer3.toString().replace(/::/g, `\n`).replace(/,/g, ``)
            } else {
                onServer3 = `\u200B`;
            }
            if(onServer[16] !== undefined && onServer[20] !== undefined) {
                onServer4 = onServer.slice(16, 20)
                onServer4 = onServer4.toString().replace(/::/g, `\n`).replace(/,/g, ``)
            } else {
                onServer4 = `\u200B`;
            }
            onServer = onServer.slice(0, 5)
            onServer = onServer.toString().replace(/::/g, `\n`).replace(/,/g, ``)
        }
        if(onServer.lenght > 1000) {
            onServer = 'Aucun :('
        }
        if(onServer2.lenght > 1000) {
            onServer2 = `\u200B`
        }
        if(onServer3.lenght > 1000) {
            onServer3 = `\u200B`
        }
        if(onServer4.lenght > 1000) {
            onServer4 = `\u200B`
        }
        var embed = new Discord.MessageEmbed()
        .setAuthor(`Liste des giveaways`)
        .setThumbnail(client.user.avatarURL())
        .setColor(`#F79430`)
        .addField(`\u200B`, onServer || `Aucun giveaway trouvé`)
        .addField(`\u200B`, `${onServer2 || `\u200B`}`)
        .addField(`\u200B`, `${onServer3 || `\u200B`}`)
        .addField(`\u200B`, `${onServer4 || `\u200B`}\n\n\u200B`)
        .addField(`Info!`, `*la liste ne peut afficher que 20 giveaways ainsi que ceux qui sont encore en cours*`)
        .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL())
        .setTimestamp()
        message.channel.send(embed)
}

module.exports.help = {
  name:"list"
} 