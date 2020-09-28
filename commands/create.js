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
    var adapting = new FileSync(`./data/${client.shard.ids[0]}/${message.guild.id}.json`);
    var database = low(adapting);
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
                let opembed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Une opération est déà en cours d'éxécution*`)
                .setFooter(`TADAA | créé par ezzud`)
        if(!message.guild.member(client.user).hasPermission(19456)) return(message.channel.send(permembed));
        if(database.get(`data.creation`).value() === 'on') return(message.channel.send(opembed));
		await database.set(`data.creation`, 'on').write()
        await database.set(`data.channel`, 'Erreur!').write()
        await database.set(`data.time`, 'Erreur!').write()
        await database.set(`data.winnerstr`, 'Erreur!').write()
        await database.set(`data.price`, 'Erreur!').write()
        await database.set(`data.isrequiredrole`, 'Erreur!').write()
        await database.set(`data.requiredrole`, 'Erreur!').write()
        let embedd = new Discord.MessageEmbed()
        .setTitle(`TADAA`)
        .setThumbnail(client.user.avatarURL())
        .setDescription(`${info} Création d'un giveaway`)
        .setColor(`#FA921D`)
        .addField(`Valeurs:`, `Aucune valeur définie pour le moment :(`)
        .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
        const member = message.author.id
        const channelID = message.channel.id
        await message.channel.send(embedd).then(async msg => {









                embed = new Discord.MessageEmbed()
                .setColor('F58F1C')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`Tout d'abord, veuillez mentionner le salon dans lequel le giveaway aura lieu.`)
                .setFooter(`TADAA | créé par ezzud`)
        	await message.channel.send(embed)
            let answered;
            answered = false
            while(answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(message.channel.id !== channelID) {
                        answered = false
                        return;                
                    }
                    if(collected.first().author.id !== member) {
                        answered = false
                        return;                
                    }
                    if(mess === "cancel") {
                        await database.set(`data.channel`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${okay} *Opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        answered = true
                        return msg.delete();	
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('#', '')
                    let channel = message.guild.channels.cache.get(mess)
                    if (!channel) {
                        await database.set(`data.channel`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Veuillez mentionner un salon, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return;
                    } else {
                    	if(channel.type !== 'text') {
                            await database.set(`data.channel`, 'Erreur!').write()
                            await database.set(`data.creation`, 'off').write()
                            answered = true
                            embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Veuillez mentionner un salon __textuel__, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                            return message.channel.send(embed);
                        }
                        await database.set(`data.channel`, channel.id).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setThumbnail(client.user.avatarURL())
                         .setColor(`#FA921D`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .addField(`Valeurs:`, `Salon: <#${await database.get(`data.channel`).value()}>`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
                        await msg.edit(editembed)
                        answered = true
                    }   
                        
                }).catch(async (err) => {
                                    embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.channel`, 'Erreur!').write()
                    console.log(err)
                    answered = true
                    return;
                });
            }
            if(database.get(`data.channel`).value() === 'Erreur!') {
            	await database.set(`data.creation`, 'off').write()
            	return;
            }
            if(!message.guild.channels.cache.get(database.get(`data.channel`).value()).memberPermissions(message.guild.member(client.user)).has(19456)) {
                message.channel.send(`:warning: ATTENTION, je n'ai pas les permissions d'envoyer des embeds, d'envoyer des messages ou de voir le salon. Je ne pourrais donc pas commencer le giveaway`)
            }

                if(database.get(`data.creation`).value() === 'off') {
                    return;
                }









                embed = new Discord.MessageEmbed()
                .setColor('F58F1C')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`Ensuite, veuillez renseigner la durée du giveaway (exemples: 10s, 10m, 10d, 1w)`)
                .setFooter(`TADAA | créé par ezzud`)
            await message.channel.send(embed)
            answered = false
            while(answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(message.channel.id !== channelID) {
                        answered = false
                        return;                
                    }
                    if(collected.first().author.id !== member) {
                        answered = false
                        return;                
                    }
                    if(mess === "cancel") {
                        await database.set(`data.time`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${okay} *Opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        answered = true
                        return msg.delete();	
                    }
                    let timems = ms(mess)
                    if(!timems) {
                        await database.set(`data.time`, 'Erreur!').write()
                        answered = true
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Veuillez rentrer une durée valide (exemple: 10s, 10m, 10d), opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return;
                    } else {
                        mess = mess.replace(/-/g, '')
                        await database.set(`data.time`, mess).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .setThumbnail(client.user.avatarURL())
                         .setColor(`#FA921D`)
                         .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
                        await msg.edit(editembed)
                        answered = true
                    }
                }).catch(async () => {
                                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.time`, 'Erreur!').write()
                    answered = true
                    return;
                });
            }
            if(database.get(`data.time`).value() === 'Erreur!') {
                await database.set(`data.creation`, 'off').write()
                return;
            }
                if(database.get(`data.creation`).value() === 'off') {
                    return;
                }










                embed = new Discord.MessageEmbed()
                .setColor('F58F1C')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`Renseignez maintenant le nombre de gagnants qui seront tirés au sort`)
                .setFooter(`TADAA | créé par ezzud`)
            await message.channel.send(embed)
            answered = false
            while(answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(message.channel.id !== channelID) {
                        answered = false
                        return;                
                    }
                    if(collected.first().author.id !== member) {
                        answered = false
                        return;                
                    }
                    if(mess === "cancel") {
                        await database.set(`data.winnerstr`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${okay} *Opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        answered = true
                        return msg.delete();	
                    }
                    mess = mess.replace(/-/g, '')
                    mess = parseInt(mess)
                    mess = mess.toString()
                    if(mess === 'NaN') {
                        await database.set('winnerstr', 'Erreur!').write()
                        await database.set('creation', 'Erreur!').write()
                        answered = true
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Vous devez entrer un nombre, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return;
                    } else {
                        parseInt(mess)
                        Math.trunc(mess);
                        await database.set(`data.winnerint`, mess).write()
                        await database.set(`data.winnerstr`, mess.toString()).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setThumbnail(client.user.avatarURL())
                         .setColor(`#FA921D`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
                         answered = true
                        await msg.edit(editembed)
                    }  
                }).catch(async () => {
                                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.winnerstr`, 'Erreur!').write()
                    answered = true
                    return;
                });
            }
                if(database.get(`data.winnerstr`).value() === 'Erreur!') {
                	await database.set(`data.creation`, 'off').write()
                	return;
                }
                if(database.get(`data.creation`).value() === 'off') {
                    return;
                }









                embed = new Discord.MessageEmbed()
                .setColor('F58F1C')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`Veuillez rentrer le prix à gagner`)
                .setFooter(`TADAA | créé par ezzud`)
            await message.channel.send(embed)
            answered = false
            while(answered === false) {
                await message.channel.awaitMessages(async m => m.author.id === message.author.id,
                    {max: 1, time: 60000}).then(async collected => {
                        let mess = collected.first().content
                    if(message.channel.id !== channelID) {
                        answered = false
                        return;                
                    }
                    if(collected.first().author.id !== member) {
                        answered = false
                        return;                
                    }
                        if(mess === "cancel") {
                            await database.set(`data.price`, 'Erreur!').write()
                            await database.set(`data.creation`, 'off').write()
                                            embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${okay} *Opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                            answered = true
                            return msg.delete();    
                        }
                        if(mess.lenght > 100) {
                            await database.set(`data.price`, 'Erreur!').write()
                            await database.set(`data.creation`, 'off').write()
                            answered = true
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Votre prix ne peut pas faire plus de 100 caractères, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                            return;
                        } else {
                            await database.set(`data.price`, mess).write()
                            var editembed = new Discord.MessageEmbed()  
                             .setTitle(`TADAA`)
                             .setThumbnail(client.user.avatarURL())
                             .setColor(`#FA921D`)
                             .setDescription(`${info} Création d'un giveaway`)
                             .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nPrix: \`${database.get(`data.price`).value()}\` `)
                             .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
                             answered = true
                            await msg.edit(editembed)
                        }  
                    }).catch(async () => {
                                                            embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        await database.set(`data.creation`, 'off').write()
                        await database.set(`data.price`, 'Erreur!').write()
                        answered = true
                        return;
                    });
                }
                if(database.get(`data.price`).value() === 'Erreur!') { 
                    await database.set(`data.creation`, 'off').write()
                    return;
                }
                if(database.get(`data.creation`).value() === 'off') {
                    return;
                }




                embed = new Discord.MessageEmbed()
                .setColor('F58F1C')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`Souhaitez-vous que seuls les utilisateurs possédant un certain rôle puissent participer? \`oui/non\``)
                .setFooter(`TADAA | créé par ezzud`)
            await message.channel.send(embed)
            answered = false
            while(answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(message.channel.id !== channelID) {
                        answered = false
                        return;                
                    }
                    if(collected.first().author.id !== member) {
                        answered = false
                        return;                
                    }
                    if(mess === "cancel") {
                        await database.set(`data.isrequiredrole`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${okay} *Opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return msg.delete();    
                    }
                    mess = mess.toLowerCase();
                    if(mess !== "oui" && mess !== "non") {
                        await database.set(`data.creation`, 'off').write()
                        await database.set(`data.isrequiredrole`, 'Erreur!').write()
                        answered = true
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Vous devez choisir entre oui ou non, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return; 
                    }
                        await database.set(`data.isrequiredrole`, mess).write()
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setThumbnail(client.user.avatarURL())
                         .setColor(`#FA921D`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nRôle requis?: **${database.get(`data.isrequiredrole`).value()}**`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
                         answered = true
                        await msg.edit(editembed)
                    
                }).catch(async () => {
                                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.isrequiredrole`, 'Erreur!').write()
                    answered = true
                    return;
                });
            }
                if(database.get(`data.isrequiredrole`).value() === 'Erreur!') {
                    await database.set(`data.creation`, 'off').write()
                    return;
                }
                if(database.get(`data.creation`).value() === 'off') {
                    return;
                }






            if(await database.get(`data.isrequiredrole`).value() === 'oui') {

                embed = new Discord.MessageEmbed()
                .setColor('F58F1C')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`Mentionnez ou donnez l'id du rôle souhaité`)
                .setFooter(`TADAA | créé par ezzud`)
            await message.channel.send(embed)
            answered = false
            while(answered === false) {
            await message.channel.awaitMessages(async m => m.author.id === message.author.id,
                {max: 1, time: 60000}).then(async collected => {
                    let mess = collected.first().content
                    if(message.channel.id !== channelID) {
                        answered = false
                        return;                
                    }
                    if(collected.first().author.id !== member) {
                        answered = false
                        return;                
                    }
                    if(mess === "cancel") {
                        await database.set(`data.requiredrole`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${okay} *Opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return msg.delete();    
                    }
                    mess = mess.replace('<', '')
                    mess = mess.replace('>', '')
                    mess = mess.replace('@&', '')
                    mess = mess.replace(' ', '')
                    let role = message.guild.roles.cache.get(mess)
                    
                    if(!role) {
                        await database.set(`data.requiredrole`, 'Erreur!').write()
                        await database.set(`data.creation`, 'off').write()
                        answered = true
                embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Rôle introuvable, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return;
                    } else {
                        await database.set(`data.requiredrole`, role.id).write()
                    }
                        if(await database.get(`data.requiredrole`).value() === 'Erreur!') return;
                        var editembed = new Discord.MessageEmbed()  
                         .setTitle(`TADAA`)
                         .setThumbnail(client.user.avatarURL())
                         .setColor(`#FA921D`)
                         .setDescription(`${info} Création d'un giveaway`)
                         .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nRôle requis?: **${database.get(`data.isrequiredrole`).value()}\nRôle: <@&${database.get(`data.requiredrole`).value()}>`)
                         .setFooter(`Tapez 'cancel' pour annuler |  créé par ezzud`, message.author.avatarURL())
                         answered = true
                        await msg.edit(editembed)
                    
                }).catch(async () => {
                                                        embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                    await database.set(`data.creation`, 'off').write()
                    await database.set(`data.requiredrole`, 'Erreur!').write()
                    answered = true
                    return;
                });
            }
                if(database.get(`data.requiredrole`).value() === 'Erreur!') {
                    await database.set(`data.creation`, 'off').write()
                    return;
                }
                msg.delete()
            }
        	})
        	if(database.get(`data.channel`).value() === 'Erreur!' || database.get(`data.time`).value() === 'Erreur!' || database.get(`data.winnerstr`).value() === 'Erreur!' || database.get(`data.price`).value() === 'Erreur!') {
        		await database.set(`data.creation`, 'off').write()
        		return;
        	}
                if(database.get(`data.creation`).value() === 'off') {
                    return;
                }

            if(await database.get(`data.isrequiredrole`).value() === 'oui') {
        	var editedembed = new Discord.MessageEmbed()  
        	 .setTitle(`TADAA`)
        	 .setDescription(`${what} Confirmation de la création du giveaway`)
        	 .setThumbnail(client.user.avatarURL())
        	 .setColor(`#FA921D`)
        	 .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nPrix: \`${database.get(`data.price`).value()}\`\nRole requis: <@&${database.get(`data.requiredrole`).value()}>`)
        	 .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL())
        	message.channel.send(editedembed).then(async msg2 => {
            	await msg2.react('✅');
            	await msg2.react('❌');
            	const filter = (reaction, user) => {
            	    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
            	};
            	await msg2.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            		.then(async collected => {
                		const reaction = collected.first();
						if (reaction.emoji.name === '✅') {
                			msg2.delete()
                            await database.set(`data.creation`, `off`).write()
                            manager.start(message.guild.channels.cache.get(`${database.get(`data.channel`).value()}`), {
                                time: ms(`${database.get(`data.time`).value()}`),
                                prize: `${database.get(`data.price`).value()}`,
                                winnerCount: parseInt(`${database.get(`data.winnerstr`).value()}`),
                                IsRequiredRole: true,
                                requiredRole: database.get(`data.requiredrole`).value()
                            }).then(async (gData) => { 
                                console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`); 
                             embed = new Discord.MessageEmbed()
                            .setColor('24E921')
                            .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                            .setDescription(`${okay} Le giveaway a été lancé dans le salon ${message.guild.channels.cache.get(`${database.get(`data.channel`).value()}`)}` )
                            .setFooter(`TADAA | créé par ezzud`)
                            await message.channel.send(embed)
                                await database.set(`data.channel`, `Erreur!`).write()
                                await database.set(`data.time`, `Erreur!`).write()
                                await database.set(`data.winnerstr`, `Erreur!`).write()
                                await database.set(`data.price`, `Erreur!`).write()
                            }).catch(async (err) => {
                                console.error(err)
                            });

            			} else {
                			msg2.delete()
            				await database.set(`data.channel`, `Erreur!`).write()
            				await database.set(`data.time`, `Erreur!`).write()
            				await database.set(`data.winnerstr`, `Erreur!`).write()
            				await database.set(`data.price`, `Erreur!`).write()
            				await database.set(`data.creation`, `off`).write()
            			}
                	}).catch(() => {
                		                                    embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                		return;
                	});
        		})
} else {
            var editedembed = new Discord.MessageEmbed()  
             .setTitle(`TADAA`)
             .setDescription(`${what} Confirmation de la création du giveaway`)
             .setThumbnail(client.user.avatarURL())
             .setColor(`#FA921D`)
             .addField(`Valeurs:`, `Salon: <#${database.get(`data.channel`).value()}>\nDurée: **${database.get(`data.time`).value()}**\nNombre de gagnants: **${database.get(`data.winnerstr`).value()}**\nPrix: \`${database.get(`data.price`).value()}\` `)
             .setFooter(`TADAA | créé par ezzud`, message.author.avatarURL())
            message.channel.send(editedembed).then(async msg2 => {
                await msg2.react('✅');
                await msg2.react('❌');
                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                await msg2.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                    .then(async collected => {
                        const reaction = collected.first();
                        if (reaction.emoji.name === '✅') {
                            msg2.delete()
                            await database.set(`data.creation`, `off`).write()
                            manager.start(message.guild.channels.cache.get(`${database.get(`data.channel`).value()}`), {
                                time: ms(`${database.get(`data.time`).value()}`),
                                prize: `${database.get(`data.price`).value()}`,
                                winnerCount: parseInt(`${database.get(`data.winnerstr`).value()}`),
                                IsRequiredRole: false,
                                requiredRole: null
                            }).then(async (gData) => { 
                                console.log(`SHARD #${client.shard.ids[0]} - Nouveau giveaway lancé dans le serveur " ${client.guilds.cache.get(gData.guildID).name} "`); 
                             embed = new Discord.MessageEmbed()
                            .setColor('24E921')
                            .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                            .setDescription(`${okay} Le giveaway a été lancé dans le salon ${message.guild.channels.cache.get(`${database.get(`data.channel`).value()}`)}` )
                            .setFooter(`TADAA | créé par ezzud`)
                            await message.channel.send(embed)
                                await database.set(`data.channel`, `Erreur!`).write()
                                await database.set(`data.time`, `Erreur!`).write()
                                await database.set(`data.winnerstr`, `Erreur!`).write()
                                await database.set(`data.price`, `Erreur!`).write()
                            }).catch(async (err) => {
                                console.error(err)
                            });

                        } else {
                            msg2.delete()
                            await database.set(`data.channel`, `Erreur!`).write()
                            await database.set(`data.time`, `Erreur!`).write()
                            await database.set(`data.winnerstr`, `Erreur!`).write()
                            await database.set(`data.price`, `Erreur!`).write()
                            await database.set(`data.creation`, `off`).write()
                        }
                    }).catch(() => {
                                                            embed = new Discord.MessageEmbed()
                .setColor('E93C21')
                .setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
                .setDescription(`${nope} *Délai de 60 secondes dépassé, opération annulée*`)
                .setFooter(`TADAA | créé par ezzud`)
                message.channel.send(embed)
                        return;
                    });
                })    
}
}

module.exports.help = {
  name:"create"
} 