const Discord = require("discord.js");
module.exports.run = async (client,pf,message,args,nope,info,okay,what,warning) => {
        var embed = new Discord.MessageEmbed()
        .setTitle(`TADAA ${what}`)
        .setColor('#43FA31')
        .setThumbnail(client.user.avatarURL())
        .addField(`🎁 Commandes de giveaway`, `${warning} \`Permission requise: Gérer le serveur OU Rôle nommé 'Giveaways'\`\n\n• **${pf}create** - *Lancer la création d'un giveaway*\n• **${pf}start** \`#salon\` \`<durée>\` \`<nombre de gagnant>\` \`<prix>\` - *Lancer rapidement un giveaway*\n• **${pf}end** \`<id du message>\` - *Terminer un giveaway*\n• **${pf}reroll** \`<id du message>\` - *Choisir un/des nouveau(x) gagnant(s) d'un giveaway*\n• **${pf}delete** \`<id du message>\` - *Supprimer le giveaway*\n• **${pf}edit** \`<id du message>\` \`<gagnants|prix>\` \`<valeur>\` - *Éditer un giveaway*\n• **${pf}list** - *Afficher la liste des giveaways du serveur*\n\u200B`)
        .addField(`:wrench: Commandes de configuration`, `${warning} \`Permission requise: Administrateur\`\n\n• **${pf}config** - *Voir la configuration actuelle du bot*\n• **${pf}config prefix** \`Nouveau préfixe\` - *Changer le préfixe du bot*\n• **${pf}config dmwin** \`Oui/Non\` - *Activer ou non l'envoi d'un message privé au(x) gagnant(s)*\n\u200B`)
        .addField(`💡 Commande d'informations`, `• **${pf}info** - *Obtenir des informations sur le bot*\n• **${pf}help** - *Afficher ce message*\n• **${pf}ping** - *Voir le ping actuel du bot*`)
        .setFooter(`TADAA |  créé par ezzud`, message.author.avatarURL())
        message.channel.send(embed)
}

module.exports.help = {
  name:"help"
}