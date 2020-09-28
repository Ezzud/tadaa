const Discord = require("discord.js");

module.exports.run = async (client,pf,message,args,nope,info,okay,what,warning,manager, json) => {
let embed = new Discord.MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
.setColor('17F0C9')
.addField(`\u200B`, `*Pinging...*`)
.setFooter(`TADAA | créé par ezzud`)
message.channel.send(embed).then((msg) => {
	var timer = new Date().getTime() - message.createdTimestamp
	let color;
	if(timer > 500) {
		color = 'E3260F'
	} else if(timer < 100) {
		color = '48F728'
	} else {
		color = 'E58613'
	}
	let embed = new Discord.MessageEmbed()
	.setAuthor(message.author.tag, message.author.avatarURL(), `https://github.com/Ezzud/tadaa`)
	.setColor(color)
	.addField(`\u200B`, `Pong! *${timer}ms*`)
	.setFooter(`TADAA | créé par ezzud`)
	msg.edit(embed)
})

}

module.exports.help = {
  name:"ping"
}