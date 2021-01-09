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
        this.IsRequiredRole = options.isRequiredRole;
        this.requiredRole = options.requiredRole
        this.IsRequiredServer = options.isRequiredServer;
        this.requiredServer = options.requiredServer;
        this.requiredServerName = options.requiredServerName;
        this.ended = options.ended;
        this.channelID = options.channelID;
        this.messageID = options.messageID;
        this.guildID = options.guildID;
        this.winnerCount = parseInt(options.winnerCount);
        this.hostedBy = options.hostedBy;
        this.messages = options.messages;
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
    get content() {
        let roundTowardsZero = this.remainingTime > 0 ? Math.floor : Math.ceil;
        let days = roundTowardsZero(this.remainingTime / 86400000),
            hours = roundTowardsZero(this.remainingTime / 3600000) % 24,
            minutes = roundTowardsZero(this.remainingTime / 60000) % 60,
            seconds = roundTowardsZero(this.remainingTime / 1000) % 60;
        if (seconds === 0) seconds++;
        let isDay = days > 0,
            isHour = hours > 0,
            isMinute = minutes > 0;
        let dayUnit = days < 2 && (this.messages.units.pluralS || this.messages.units.days.endsWith('s')) ? this.messages.units.days.substr(0, this.messages.units.days.length - 1) : this.messages.units.days,
            hourUnit = hours < 2 && (this.messages.units.pluralS || this.messages.units.hours.endsWith('s')) ? this.messages.units.hours.substr(0, this.messages.units.hours.length - 1) : this.messages.units.hours,
            minuteUnit = minutes < 2 && (this.messages.units.pluralS || this.messages.units.minutes.endsWith('s')) ? this.messages.units.minutes.substr(0, this.messages.units.minutes.length - 1) : this.messages.units.minutes,
            secondUnit = seconds < 2 && (this.messages.units.pluralS || this.messages.units.seconds.endsWith('s')) ? this.messages.units.seconds.substr(0, this.messages.units.seconds.length - 1) : this.messages.units.seconds;
        let pattern = (!isDay ? '' : `{days} ${dayUnit}, `) + (!isHour ? '' : `{hours} ${hourUnit}, `) + (!isMinute ? '' : `{minutes} ${minuteUnit}, `) + `{seconds} ${secondUnit}`;
        let content = this.messages.timeRemaining.replace('{duration}', pattern).replace('{days}', days).replace('{hours}', hours).replace('{minutes}', minutes).replace('{seconds}', seconds);
        return content;
    }
    async fetchMessage() {
        return new Promise(async (resolve, reject) => {
            let message = null;
            if (this.manager.v12) {
                message = await this.channel.messages.fetch(this.messageID).catch(() => {});
            } else {
                message = await this.channel.fetchMessage(this.messageID).catch(() => {});
            }
            if (!message) {
                return reject('Unable to fetch message with ID ' + this.messageID + '.');
            }
            this.message = message;
            resolve(message);
        });
    }
    async roll(winnerCount) {
        let reaction = (this.manager.v12 ? this.message.reactions.cache : this.message.reactions).find(r => r.emoji.name === this.reaction);
        if (!reaction) return new Collection();
        let users;
        if (this.IsRequiredRole === true) {
            users = (await reaction.users.fetch()).filter(u => u.bot === this.botsCanWin).filter(u => u.id !== this.message.client.id).filter(u => this.channel.guild.member(u.id).roles.find(x => x.id === this.requiredRole)).filter(u => this.channel.guild.members.cache.get(u.id)).random(winnerCount || this.winnerCount).filter(u => u);
        } else {
            users = (await reaction.users.fetch()).filter(u => u.bot === this.botsCanWin).filter(u => u.id !== this.message.client.id).filter(u => this.channel.guild.members.cache.get(u.id)).random(winnerCount || this.winnerCount).filter(u => u);
        }
        if(this.IsRequiredServer === true) {
            let guild = this.client.guilds.cache.get(this.requiredServer)
            if(!guild) return;
            users = users.filter(u => guild.members.cache.get(u.id) !== undefined)
        }
        return users;
    }
}
module.exports = Giveaway;