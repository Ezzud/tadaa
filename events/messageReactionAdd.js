'use strict';
const Discord = require("discord.js");
module.exports = async (client, messageReaction, user) => {
	if(!messageReaction) return;
    if (messageReaction.partial) {
        try {
            await messageReaction.fetch();
            console.log('partial')
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
        }
    }
    if(!user) return;
    if (user.bot) return;
    if (messageReaction.message.channel.type === 'dm') return;
    let guild = messageReaction.message.guild
    let gw;
    gw = await client.giveawaysManager.giveaways.filter((g) => g.guildID === messageReaction.message.guild.id);
    gw = await client.giveawaysManager.giveaways.filter((g) => g.ended === false);
    if (!gw) return;
    let checkRole = false
    gw.forEach(give => {
        if (give.messageID === messageReaction.message.id) {
            checkRole = true
        } else {
            return;
        }
    })
    if (checkRole === true) {
        if (messageReaction.emoji.name !== '🎁') return;
        let gw2;
        gw2 = await client.giveawaysManager.giveaways.filter((g) => g.messageID === messageReaction.message.id);
        if (!gw2) return;
        if (gw2[0].IsRequiredRole === true) {
        let role = guild.roles.cache.find(x => x.id === gw2[0].requiredRole)
        if (!role) return;
        if (guild.member(user.id).roles.cache.find(x => x.id === role.id)) {

        } else {
            try {
                await messageReaction.users.remove(user.id)
                const embed = new Discord.MessageEmbed().setAuthor(`Erreur!`, 'https://cdn.discordapp.com/attachments/682274736306126925/740643196878454834/1596653488174.png').setColor('#ED3016').addField(`\u200B`, `Vous ne pouvez pas participer à ce giveaway car vous ne possédez pas le rôle \`${role.name}\` \n[Clique ici](https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}) pour accéder au message`)
                await user.send(embed)
            } catch (error) {
                console.error(error);
            }
        
            return;
        }
    }
    if (gw2[0].IsRequiredServer === true) {
        let guild = client.guilds.cache.get(gw2[0].requiredServer)
        let member = guild.members.cache.get(user.id)
        if(!member) {
            try {
                await messageReaction.users.remove(user.id)
                const embed = new Discord.MessageEmbed().setAuthor(`Erreur!`, 'https://cdn.discordapp.com/attachments/682274736306126925/740643196878454834/1596653488174.png').setColor('#ED3016').addField(`\u200B`, `Vous ne pouvez pas participer à ce giveaway car vous n'êtes pas sur le serveur \`${gw2[0].requiredServerName}\` \n[Clique ici](https://discordapp.com/channels/${messageReaction.message.guild.id}/${messageReaction.message.channel.id}/${messageReaction.message.id}) pour accéder au message`)
                await user.send(embed)
            } catch (error) {
                console.error(error);
            }
            
            return;     
        }
        console.log(member.id)
    }


    }
}