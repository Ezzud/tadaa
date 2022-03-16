const { EventEmitter } = require('events');
const fs = require('fs');
const Discord = require('discord.js');
const moment = require('moment')
const config = require("../config.json")
const quick = require('quick.db')
const json = require('../package.json')

class selectMenuAPI extends EventEmitter {
    constructor(client) {
        super();
        if (!client) throw new Error('Client is a required option.');
        this.client = client;
        this.manager = client.giveawaysManager
        this.ready = false;
        this._init();
    }
    reroll(lang, messageID, interaction) {
        const manager = this.manager;
        if(messageID === "cancel") {
            let fembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [fembed] })
            return;
        }
        manager.reroll(messageID).then(() => {
            let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.rerollEmbedSuccess.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [yembed]})
        }).catch((err) => {
            if (err === "GiveawayNotFound") {
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else if (err === "GiveawayUnknownChannel") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else if (err === "GiveawayNotEnded") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWNotEnded.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            }
        });
    }


    delete(lang, messageID, interaction) {
        const manager = this.manager;
        if(messageID === "cancel") {
            let fembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [fembed] })
            return;
        }
        manager.delete(messageID).then(() => {
            
            let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.deleteEmbedSuccess.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [yembed]})
        }).catch((err) => {
            if (err === "GiveawayNotFound") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else if (err === "GiveawayUnknownChannel") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            }
        });
    }

    end(lang, messageID, interaction) {
        
        if(messageID === "cancel") {
            let fembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [fembed] })
            return;
        }
        const manager = this.manager;
        manager.end(messageID).then(() => {
            
            let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.endEmbedSuccess.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [yembed]})
        }).catch((err) => {
            if (err === "GiveawayNotFound") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else if (err === "GiveawayUnknownChannel") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else if (err === "GiveawayAlreadyEnded") {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWAlreadyEnded.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            } else {
                
                let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                interaction.editReply({ embeds: [noembed]})
            }
        });
    }

    edit(lang, value, interaction) {
    	   if(value === "cancel") {
            let fembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.createOperationCanceled.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
            interaction.editReply({ embeds: [fembed] })
            return;
        }
        const manager = this.manager;
        let mode = value.split("|")[0]
        let newValue = value.split("|")[1]
        let messageID = value.split("|")[2]
        switch(mode) {
            case "w":
                newValue = parseInt(newValue)
                manager.edit(messageID, {
                    newWinnerCount: newValue,
                    addTime: 5000
                }).then(() => {
                    
                    let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editEmbedSuccess.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    interaction.editReply({ embeds: [yembed]})
                }).catch((err) => {
                    if (err === "GiveawayNotFound") {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    } else if (err === "GiveawayUnknownChannel") {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    } else if (err === "GiveawayAlreadyEnded") {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWAlreadyEnded.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    } else {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    }
                });
                break;
            case "p":
                manager.edit(messageID, {
                    newPrize: newValue,
                    addTime: 5000
                }).then(() => {
                    
                    let yembed = new Discord.MessageEmbed().setColor('24E921').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.editEmbedSuccess.split("%okay%").join(this.client.okay)).setFooter(lang.footer.split("%version%").join(json.version))
                    interaction.editReply({ embeds: [yembed]})
                }).catch((err) => {
                    if (err === "GiveawayNotFound") {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    } else if (err === "GiveawayUnknownChannel") {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownChannel.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    } else if (err === "GiveawayAlreadyEnded") {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWAlreadyEnded.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    } else {
                        
                        let noembed = new Discord.MessageEmbed().setColor('E93C21').setAuthor(interaction.user.tag, interaction.user.avatarURL(), `https://github.com/Ezzud/tadaa`).setDescription(lang.GWUnknownID.split("%nope%").join(this.client.nope)).setFooter(lang.footer.split("%version%").join(json.version))
                        interaction.editReply({ embeds: [noembed]})
                    }
                });
                break;

        }
    }

    _init() {
        console.log("Enabled select menus!")
    }


}

module.exports = selectMenuAPI;