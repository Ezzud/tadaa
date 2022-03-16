/**
 *
 *   Original creator: https://github.com/Androz2091/discord-giveaways
 *
 **/
const {
    Collection,
    Message,
    version
} = require('discord.js');
const {
    EventEmitter
} = require('events');
class Giveaway extends EventEmitter {
    constructor(manager, options) {
        super();
        this.manager = manager;
        this.client = manager.client;
        this.prize = options.prize;
        this.startAt = options.startAt;
        this.endAt = options.endAt;
        this.IsRequiredRole = options.IsRequiredRole;
        this.requiredRole = options.requiredRole
        this.IsRequiredServer = options.IsRequiredServer;
        this.requiredServer = options.requiredServer;
        this.requiredServerName = options.requiredServerName;
        this.ended = options.ended;
        this.channelID = options.channelID;
        this.messageID = options.messageID;
        this.guildID = options.guildID;
        this.winnerCount = parseInt(options.winnerCount);
        this.hostedBy = options.hostedBy;
        this.messages = options.messages;
        this.lang = options.lang;
        this.options = options;
    }
    get remainingTime() {
        return this.endAt - Date.now();
    }
    get giveawayDuration() {
        return this.endAt - this.startAt;
    }
    get embedColor() {
        return this.options.embedColor || this.manager.options.default.embedColor;
    }
    get embedColorEnd() {
        return this.options.embedColorEnd || this.manager.options.default.embedColorEnd;
    }
    get reaction() {
        return this.options.reaction || this.manager.options.default.reaction;
    }
    get botsCanWin() {
        return this.options.botsCanWin || this.manager.options.default.botsCanWin;
    }
    get exemptPermissions() {
        return this.options.exemptPermissions || this.manager.options.default.exemptPermissions;
    }
    get exemptMembers() {
        return this.options.exemptMembers || this.manager.options.default.exemptMembers;
    }
    get channel() {
        return this.manager.v12 ? this.client.channels.cache.get(this.channelID) : this.client.channels.get(this.channelID);
    }
    async fetchMessage() {
        return new Promise(async (resolve, reject) => {
            let message = null;
            message = await this.channel.messages.fetch(this.messageID).catch(() => {});
            if (!message) {
                return reject('Unable to fetch message with ID ' + this.messageID + '.');
            }
            this.message = message;
            return resolve(message);
        });
    }
    async roll(winnerCount) {
        let reaction = (this.message.reactions.cache).find(r => r.emoji.name === this.reaction);
        if (!reaction) return new Collection();
        let users;
            users = (await reaction.users.fetch())
            .filter(u => u.bot === false)
            .filter(u => u.id !== this.message.client.id)
            .filter(u => this.channel.guild.members.cache.get(u.id) !== undefined)
            if(this.IsRequiredRole === true) {
                users = users.filter(u => this.channel.guild.members.cache.get(u.id).roles.cache.find(x => x.id === this.requiredRole))
            }
            let wCount = winnerCount || this.winnerCount
            let winners = []
            users = Array.from(users)
            for(let i = 0; i < wCount ; i++) {
                let found = false;
                while(found === false) {
                    let pwIndex = Math.floor(Math.random() * users.length) 
                    let pw = users[pwIndex]
                    if(users.length <= winners.length) {
                        found = true;
                        continue;
                    }
                    if(winners.find(x => x === pw[1].id)) {
                    } else {
                        winners.push(pw[1].id)
                        found = true
                    }
                    
                    
                }

               
            }
            return winners;
        
    }
}
module.exports = Giveaway;