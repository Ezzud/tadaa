/**
 *
 *   Original creator: https://github.com/Androz2091/discord-giveaways
 *
 **/
/* /////////////////////////////////////////////////


        Variables


*/ /////////////////////////////////////////////////
const {
    EventEmitter
} = require('events');
const mergeOptions = require('merge-options');
const Discord = require('discord.js');
const {
    GiveawaysManagerOptions
} = require('./Util');
const Giveaway = require('./Giveaway');
const moment = require('moment')
const quick = require('quick.db')
const db = new quick.table("giveaways")
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};
/* /////////////////////////////////////////////////


        Main Code


*/ /////////////////////////////////////////////////
class GiveawaysManager extends EventEmitter {
    constructor(client, options) {
        super();
        if (!client) throw new Error('Client is a required option.');
        this.client = client;
        this.ready = false;
        this.giveaways = [];
        this.options = mergeOptions(GiveawaysManagerOptions, options);
        this.v12 = true;
        this._init();
    }
    end(messageID) {
        return new Promise(async (resolve, reject) => {
            let storageContent = await db.get("giveaways");
            let giveaways = storageContent;
            if (giveaways.length <= 0) return;
            this.giveaways = giveaways;
            let giveawayData = this.giveaways.find(g => g.messageID === messageID);
            if (!giveawayData) {
                return reject('GiveawayNotFound');
            }
            let giveaway = new Giveaway(this, giveawayData);
            if (!giveaway.channel) {
                return reject('GiveawayUnknownChannel');
            }
            if (giveaway.ended === true) {
                return reject("GiveawayAlreadyEnded");
            }
            await giveaway.fetchMessage().catch(() => {});
            if (!giveaway.message) {
                return reject('GiveawayNotFound');
            }
            if (!giveaway.options.langfile) {
                giveaway.options.langfile = require(`../lang/${giveaway.lang}.json`);
            }
            if(giveaway.options.shardID !== this.client.shard.ids[0]) return;
            await this._markAsEnded(giveaway.messageID);
            var requirements = "";
            if (giveaway.options.IsRequiredRole === true) {
                requirements = requirements + `${giveaway.options.langfile.managerEmbedRole.split("%requiredRole%").join(`<@&${giveaway.requiredRole}>`)}\n`;
            }
            if (giveaway.options.IsRequiredServer === true) {
                requirements = requirements + `${giveaway.options.langfile.managerEmbedServer.split("%requiredServerName%").join(giveaway.requiredServerName).split("%serverInvite%").join(giveaway.requiredServerInvite)}`;
            }
            if (requirements && requirements !== "") {
                requirements = `\n${giveaway.options.langfile.requirements}\n${requirements}`;
            }
            let winners = await giveaway.roll();
            if (winners.length > 0) {
                let formattedWinners = winners.map(w => '<@' + w.id + '>').join(', ');
                let date = new Date()
                date.setHours(date.getHours() + 1);
                let embed = this.v12 ? new Discord.MessageEmbed() : new Discord.MessageEmbed();
                embed.setAuthor(giveaway.options.langfile.managerEndedTitle).setColor(`#EF1106`)
                .setThumbnail('https://ezzud.fr/images/openedFixed.png')
                .setFooter(giveaway.options.langfile.managerEndedFooter.split("%date%").join(moment(date).format('L'))).setTimestamp(date)
                .setDescription(giveaway.options.langfile.managerEmbedDescription.split("%prize%").join(giveaway.prize))
                .addField(`\u200B`, `\n\n${giveaway.options.langfile.managerEmbedWinners.split("%winnerCount%").join(giveaway.winnerCount)}\n${giveaway.options.langfile.managerHostedBy.split("%hostedby%").join(giveaway.hostedBy)}\n${requirements}\n\n${giveaway.options.langfile.managerEndedWinners.split("%formattedWinners%").join(formattedWinners)}\n\u200B`)
                .addField(`\u200B`, `[Upvote](https://top.gg/bot/732003715426287676) - [Invite](https://discord.com/api/oauth2/authorize?client_id=732003715426287676&permissions=379968&scope=bot)`)
                await giveaway.message.edit({
                    embed
                }).catch(err => {
                    console.log(err)
                })
                if (winners.length > 1) {
                    await giveaway.message.channel.send(giveaway.options.langfile.winMessageP.replace('{winners}', formattedWinners).replace('{prize}', giveaway.prize));
                } else {
                    await giveaway.message.channel.send(giveaway.options.langfile.winMessageS.replace('{winners}', formattedWinners).replace('{prize}', giveaway.prize));
                }
                await this.emit('end', giveaway, winners);
                resolve(winners);
            } else {
                let date = new Date()
                date.setHours(date.getHours() + 1);
                let embed = new Discord.MessageEmbed()
                embed.setAuthor(giveaway.options.langfile.managerEndedTitle)
                .setThumbnail('https://ezzud.fr/images/openedFixed.png')
                .setColor(`#EF1106`)
                .setDescription(giveaway.options.langfile.managerEmbedDescription.split("%prize%").join(giveaway.prize))
                .setFooter(giveaway.options.langfile.managerEndedFooter.split("%date%").join(moment(date).format('L')))
                .setTimestamp(date)
                .addField(`\u200B`, `\n\n${giveaway.options.langfile.managerEmbedWinners.split("%winnerCount%").join(giveaway.winnerCount)}\n${giveaway.options.langfile.managerHostedBy.split("%hostedby%").join(giveaway.hostedBy)}\n${requirements}\n\n${giveaway.options.langfile.managerEndedNoWinner}\n\u200B`).addField(`\u200B`, `[Upvote](https://top.gg/bot/732003715426287676) - [Invite](https://discord.com/api/oauth2/authorize?client_id=732003715426287676&permissions=379968&scope=bot)`)
                await giveaway.message.edit({
                    embed
                });
                await this._markAsEnded(giveaway.messageID);
                await this.emit('end', giveaway, winners);
                resolve();
            }
        });
    }
    start(channel, options = {}) {
        return new Promise(async (resolve, reject) => {
            let storageContent = await db.get('giveaways');
            let giveaways = storageContent
            this.giveaways = giveaways
            if (!this.ready) {
                return reject('Chargement du bot...');
            }
            if (!channel || !channel.id) {
                return reject(`Le salon est introuvable. (${channel})`);
            }
            if (!options.time || isNaN(options.time)) {
                return reject(`La durée doit être un nombre! (${options.time})`);
            }
            if (!options.prize) {
                return reject(`Le prix n'est pas un texte! (${options.prize})`);
            }
            if (!options.winnerCount || isNaN(options.winnerCount)) {
                return reject(`Le nombre de gagnant n'est pas un chiffre (${options.winnerCount})`);
            }
            if (options.isRequiredRole === true && !options.requiredRole) {
                return reject(`Le RequiredRole n'est pas défini`);
            }
            if (!options.lang) {
                options.lang = "fr_FR"
            }
            if(options.shardID === undefined) {
                console.log("Fixed shard IS")
                options.shardID = 0
            }
            if(options.shardID !== this.client.shard.ids[0]) return;
            if (!options.langfile) {
                options.langfile = require(`../lang/${options.lang}.json`)
            }

            if (!options.rainbow) {
                options.rainbow = false
            }
            let color;
            if (options.rainbow === true) {
                color = Math.floor(Math.random() * 16777215).toString(16);
            } else {
                color = "#FFE5B2"
            }
            let giveaway;
            if (options.IsRequiredRole === false) {
                options.requiredRole = null
            }
            if (options.IsRequiredServer === false) {
                options.requiredServer = null
                options.requiredServerName = undefined
                options.requiredServerInvite = null
            }
            if (!options.requiredServerInvite) {
                options.requiredServerInvite = "https://github.com/Ezzud/tadaa"
            }
            giveaway = new Giveaway(this, {
                startAt: Date.now(),
                endAt: Date.now() + options.time,
                winnerCount: options.winnerCount,
                channelID: channel.id,
                guildID: channel.guild.id,
                ended: false,
                IsRequiredRole: options.IsRequiredRole,
                requiredRole: options.requiredRole,
                IsRequiredServer: options.IsRequiredServer,
                requiredServer: options.requiredServer,
                requiredServerName: options.requiredServerName,
                prize: options.prize,
                hostedBy: (options.hostedBy ? options.hostedBy.toString() : null),
                reaction: options.reaction,
                lang: options.lang,
                langfile: options.langfile,
                shardID: options.shardID,
                rainbow: options.rainbow,
                botsCanWin: options.botsCanWin,
                exemptPermissions: options.exemptPermissions,
                exemptMembers: options.exemptMembers,
                embedColor: options.embedColor,
                embedColorEnd: options.embedColorEnd,
                requiredServerInvite: options.requiredServerInvite,
                reaction: options.reaction
            });
            let date = new Date(giveaway.endAt);
            let embed;
            giveaway.IsRequiredRole = options.IsRequiredRole
            giveaway.IsRequiredServer = options.IsRequiredServer
            giveaway.requiredServerInvite = options.requiredServerInvite
            giveaway.shardID = options.shardID
            giveaway.lang = options.lang
            giveaway.langfile = options.langfile
            var requirements = ""
            if (giveaway.options.IsRequiredRole === true) {
                requirements = requirements + `${giveaway.options.langfile.managerEmbedRole.split("%requiredRole%").join(`<@&${giveaway.requiredRole}>`)}\n`
            }
            if (giveaway.options.IsRequiredServer === true) {
                requirements = requirements + `**${giveaway.options.langfile.managerEmbedServer.split("%requiredServerName%").join(giveaway.requiredServerName).split("%serverInvite%").join(giveaway.requiredServerInvite)}**`
            }
            if (requirements && requirements !== "") {
                requirements = `\n${giveaway.options.langfile.requirements}\n${requirements}`
            }
            embed = new Discord.MessageEmbed();
            var formatedDate = giveaway.endAt.toString();
            formatedDate = formatedDate.substring(0, formatedDate.length - 3)
            formatedDate = parseInt(formatedDate)
            embed.setAuthor(giveaway.options.langfile.managerEmbedTitle).setColor(color).setThumbnail('https://ezzud.fr/images/closedFixed.png')
            .setFooter(giveaway.options.langfile.managerEmbedFooter.split("%date%").join(moment(date).format('L')))
            .setTimestamp(date).setDescription(giveaway.options.langfile.managerEmbedDescription.split("%prize%").join(giveaway.prize))
            .addField(`\u200B`, `\n\n${giveaway.options.langfile.managerEmbedWinners.split("%winnerCount%").join(giveaway.winnerCount)}\n${giveaway.options.langfile.managerHostedBy.split("%hostedby%").join(giveaway.hostedBy)}\n${giveaway.options.langfile.managerEmbedTime.split("%content%").join(`<t:${formatedDate}:R> (<t:${formatedDate}>)`)}\n${requirements}\n\u200B`)
            let message = await channel.send({
                embed
            }).catch(error => {
                if (error.code === 50001) {
                    console.log(`Erreur: Missing Access | ID: ${giveaway.guildID}`)
                    return;
                }
                if (error.code === 50013) {
                    console.log(`Erreur: Missing Permissions | ID: ${giveaway.guildID}`)
                    return;
                }
            })
            giveaway.messageID = message.id;
            await this.giveaways.push(giveaway);
            await this._saveGiveaway(giveaway);
            await this._checkGiveaway()
            await message.react(giveaway.reaction);
            return resolve(giveaway);
        });
    }
    reroll(messageID, options = {}) {
        return new Promise(async (resolve, reject) => {
            let storageContent = await db.get("giveaways")
            let giveaways = storageContent
            if (giveaways.length <= 0) return;
            this.giveaways = giveaways
            let giveawayData = this.giveaways.find(g => g.messageID === messageID);
            if (!giveawayData) {
                return reject(`GiveawayNotFound`);
            }
            let giveaway = new Giveaway(this, giveawayData);
            if (!giveaway.ended) {
                return reject(`GiveawayNotEnded`);
            }
            if(giveaway.options.shardID !== this.client.shard.ids[0]) return;
            if (!giveaway.channel) {
                return reject(`GiveawayUnknownChannel`);
            }
            await giveaway.fetchMessage().catch(() => {});
            if (!giveaway.message) {
                return reject(`GiveawayNotFound`);
            }
            if (!giveaway.options.lang) {
                giveaway.options.lang = "fr_FR"
            }
            if (!giveaway.options.langfile) {
                giveaway.options.langfile = require(`../lang/${giveaway.options.lang}.json`)
            }
            let winners = await giveaway.roll();
            if (winners.length > 0) {
                let formattedWinners = winners.map(w => '<@' + w.id + '>').join(', ');
                giveaway.channel.send(giveaway.options.langfile.managerRerollMessage.replace('%winners%', formattedWinners));
                resolve(winners);
            } else {
                giveaway.channel.send(giveaway.options.langfile.managerRerollError);
                resolve(new Array());
            }
        });
    }
    edit(messageID, options = {}) {
        return new Promise(async (resolve, reject) => {
            let storageContent = await db.get("giveaways")
            let giveaways = storageContent
            if (giveaways.length <= 0) return;
            this.giveaways = giveaways
            let giveawayData = this.giveaways.find(g => g.messageID === messageID);
            if (!giveawayData) {
                return reject(`GiveawayNotFound`);
            }
            let giveaway = new Giveaway(this, giveawayData);
            if (giveaway.ended) {
                return reject(`GiveawayAlreadyEnded`);
            }
            if(giveaway.options.shardID !== this.client.shard.ids[0]) return;
            if (!giveaway.channel) {
                return reject(`GiveawayUnknownChannel`);
            }
            await giveaway.fetchMessage().catch(() => {});
            if (!giveaway.message) {
                return reject(`GiveawayNotFound`);
            }
            let modifiedGiveawayData = giveawayData;
            if (options.newWinnerCount) modifiedGiveawayData.winnerCount = options.newWinnerCount;
            if (options.newPrize) modifiedGiveawayData.prize = options.newPrize;
            if (options.addTime) modifiedGiveawayData.endAt = giveawayData.endAt + options.addTime;
            if (options.setEndTimestamp) modifiedGiveawayData.endAt = options.setEndTimestamp;
            let newGiveaway = new Giveaway(this, modifiedGiveawayData);
            let giveaway_Data;
            giveaway_Data = {
                messageID: modifiedGiveawayData.messageID,
                channelID: modifiedGiveawayData.channelID,
                guildID: modifiedGiveawayData.guildID,
                startAt: modifiedGiveawayData.startAt,
                endAt: modifiedGiveawayData.endAt,
                ended: modifiedGiveawayData.ended,
                winnerCount: modifiedGiveawayData.winnerCount,
                IsRequiredRole: modifiedGiveawayData.IsRequiredRole,
                requiredRole: modifiedGiveawayData.requiredRole,
                prize: modifiedGiveawayData.prize,
                IsRequiredServer: modifiedGiveawayData.IsRequiredServer,
                requiredServer: modifiedGiveawayData.requiredServer,
                requiredServerName: modifiedGiveawayData.requiredServerName,
                hostedBy: (modifiedGiveawayData.hostedBy ? modifiedGiveawayData.hostedBy.toString() : null),
                lang: modifiedGiveawayData.lang,
                shardID: modifiedGiveawayData.shardID,
                langfile: modifiedGiveawayData.langfile,
                requiredServerInvite: modifiedGiveawayData.requiredServerInvite,
                rainbow: modifiedGiveawayData.rainbow
            };
            this.giveaways = this.giveaways.filter(g => g.messageID !== modifiedGiveawayData.messageID);
            await this.giveaways.push(giveaway_Data);
            await db.set("giveaways", this.giveaways);
            storageContent = await db.get("giveaways")
            giveaways = storageContent
            this.giveaways = giveaways
            resolve(newGiveaway);
        });
    }
    delete(messageID, doNotDeleteMessage) {
        return new Promise(async (resolve, reject) => {
            let storageContent = await db.get("giveaways")
            let giveaways = storageContent
            if (giveaways.length <= 0) return;
            this.giveaways = giveaways
            let giveawayData = this.giveaways.find(g => g.messageID === messageID);
            if (!giveawayData) {
                return reject(`GiveawayNotFound`);
            }
            let giveaway = new Giveaway(this, giveawayData);
            if (!giveaway.channelID) {
                return reject(`GiveawayUnknownChannel`);
            }
            if (!doNotDeleteMessage) {
                await giveaway.fetchMessage().catch(() => {});
                if (giveaway.message) {
                    giveaway.message.delete();
                }
            }
            this.giveaways = this.giveaways.filter(g => g.messageID !== giveawayData.messageID);
            await db.set("giveaways", this.giveaways);
            resolve();
        });
    }
    async _initStorage() {
        let storageExists = await db.get("giveaways")
        if (!storageExists) {
            await db.set("giveaways", [])
            return [];
        } else {
            let storageContent = await db.get("giveaways")
            try {
                let giveaways = storageContent
                if (Array.isArray(giveaways)) {
                    return giveaways;
                } else {
                    throw new SyntaxError('The storage file is not properly formatted.');
                }
            } catch (e) {
                if (e.message === 'Unexpected end of JSON input') {
                    throw new SyntaxError('The storage file is not properly formatted.', e);
                } else {
                    throw e;
                }
            }
        }
    }
    async _saveGiveaway(giveaway) {
        let storageContent = await db.get("giveaways")
        let giveaways = storageContent
        this.giveaways = giveaways
        this.giveaways = this.giveaways.filter(g => g.messageID !== giveaway.messageID);
        let giveawayData;
        giveawayData = {
            messageID: giveaway.messageID,
            channelID: giveaway.channelID,
            guildID: giveaway.guildID,
            startAt: giveaway.startAt,
            endAt: giveaway.endAt,
            ended: giveaway.ended,
            lang: giveaway.lang,
            winnerCount: giveaway.winnerCount,
            IsRequiredRole: giveaway.IsRequiredRole,
            requiredRole: giveaway.requiredRole,
            prize: giveaway.prize,
            shardID: giveaway.shardID,
            IsRequiredServer: giveaway.IsRequiredServer,
            requiredServer: giveaway.requiredServer,
            requiredServerName: giveaway.requiredServerName,
            requiredServerInvite: giveaway.requiredServerInvite,
            rainbow: giveaway.rainbow
        };
        if (giveaway.options.hostedBy) giveawayData.hostedBy = giveaway.options.hostedBy;
        if (giveaway.options.embedColor) giveawayData.embedColor = giveaway.options.embedColor;
        if (giveaway.options.embedColorEnd) giveawayData.embedColorEnd = giveaway.options.embedColorEnd;
        if (giveaway.options.botsCanWin) giveawayData.botsCanWin = giveaway.options.botsCanWin;
        if (giveaway.options.exemptPermissions) giveawayData.exemptPermissions = giveaway.options.exemptPermissions;
        if (giveaway.options.exemptMembers) giveawayData.exemptMembers = giveaway.options.exemptMembers;
        if (giveaway.options.reaction) giveawayData.reaction = giveaway.options.reaction;
        if (giveaway.options.IsRequiredRole) giveawayData.IsRequiredRole = giveaway.options.IsRequiredRole;
        if (giveaway.options.IsRequiredServer) giveawayData.IsRequiredServer = giveaway.options.IsRequiredServer;
        if (giveaway.options.lang) giveawayData.lang = giveaway.options.lang
        if (giveaway.options.requiredServerInvite) giveawayData.requiredServerInvite = giveaway.options.requiredServerInvite
        if (giveaway.options.rainbow) giveawayData.rainbow = giveaway.options.rainbow
        if (giveaway.options.shardID) giveawayData.shardID = giveaway.options.shardID
        if(giveaway.options.shardID === undefined) {
            giveawayData.shardID = 0
        }
        if(giveawayData.shardID !== this.client.shard.ids[0]) return;
        await this.giveaways.push(giveawayData);
        await db.set("giveaways", this.giveaways);
        await this._checkGiveaway()
        return;
    }
    async _markAsEnded(messageID) {
        let storageContent = await db.get("giveaways")
        let giveaways = storageContent
        if (giveaways.length <= 0) return;
        this.giveaways = giveaways
        this.giveaways.find(g => g.messageID === messageID).ended = true;
        await db.set("giveaways", this.giveaways);
        return;
    }
    async _checkGiveaway() {
        let storageContent = await db.get("giveaways")
        let giveaways = storageContent
        if (giveaways.length <= 0) return;
        giveaways.forEach(async giveawayData => {
            let giveaway = new Giveaway(this, giveawayData);
            let actual_date = new Date().getTime()
            if(actual_date - giveaway.endAt > (7776000000 * 2)) {
                console.log(`\x1b[31m[INFO]` + ` \x1b[37mGiveaway with prize "${giveaway.prize}" removed | ended ${moment(giveaway.endAt).fromNow()} (${moment(giveaway.endAt).format("L")})` + `\x1b[0m`);
                this.delete(giveaway.messageID, true)
                return;
            }
            if (giveaway.ended === true) {
                return;
            }
        if(giveaway.options.shardID === undefined) {
            giveaway.options.shardID = 0
        }
            if(giveaway.options.shardID !== this.client.shard.ids[0]) return;
            if (!giveaway.channel) return;
            await giveaway.fetchMessage().catch(() => {});
            if (!giveaway.message) {
                giveaway.ended = true;
                await this._markAsEnded(giveaway.messageID);
                return (console.log('Introuvable'));
            }
            if (!giveaway.options.langfile) {
                giveaway.options.langfile = require(`../lang/${giveaway.lang}.json`)
            }
            if (!giveaway.options.rainbow) {
                giveaway.options.rainbow = false
            }
            let color;
            if (giveaway.options.rainbow === true) {
                color = Math.floor(Math.random() * 16777215).toString(16);
            } else {
                color = "#FFE5B2"
            }
            if (!giveaway.options.requiredServerInvite) {
                giveaway.options.requiredServerInvite = "https://github.com/Ezzud/tadaa"
            }
            let date = new Date(giveaway.endAt);
            var formatedDate = giveaway.endAt.toString();
            formatedDate = formatedDate.substring(0, formatedDate.length - 3)
            formatedDate = parseInt(formatedDate)
            let embed;
            var requirements = ""
            if (giveaway.options.IsRequiredRole === true) {
                requirements = requirements + `${giveaway.options.langfile.managerEmbedRole.split("%requiredRole%").join(`<@&${giveaway.requiredRole}>`)}\n`
            }
            if (giveaway.options.IsRequiredServer === true) {
                requirements = requirements + `${giveaway.options.langfile.managerEmbedServer.split("%requiredServerName%").join(giveaway.requiredServerName).split("%serverInvite%").join(giveaway.options.requiredServerInvite)}`
            }
            if (requirements && requirements !== "") {
                requirements = `\n${giveaway.options.langfile.requirements}\n${requirements}`
            }
            embed = new Discord.MessageEmbed();
            embed.setAuthor(giveaway.options.langfile.managerEmbedTitle).setColor(color).setThumbnail('https://ezzud.fr/images/closedFixed.png')
            .setFooter(giveaway.options.langfile.managerEmbedFooter.split("%date%").join(moment(date).format('L'))).setTimestamp(date)
            .setDescription(giveaway.options.langfile.managerEmbedDescription.split("%prize%").join(giveaway.prize)).addField(`\u200B`, `\n\n${giveaway.options.langfile.managerEmbedWinners.split("%winnerCount%").join(giveaway.winnerCount)}\n${giveaway.options.langfile.managerHostedBy.split("%hostedby%").join(giveaway.hostedBy)}\n${giveaway.options.langfile.managerEmbedTime.split("%content%").join(`<t:${formatedDate}:R> (<t:${formatedDate}>)`)}\n${requirements}\n\u200B`)
            await giveaway.message.edit({
                embed
            }).catch(error => {
                if (error.code === 50001) {
                    console.log(`Erreur: Missing Access | ID: ${giveaway.guildID}`)
                    return;
                }
                if (error.code === 50013) {
                    console.log(`Erreur: Missing Permissions | ID: ${giveaway.guildID}`)
                    return;
                }
            })
            let delay = new Date()
            let delayup = delay + this.options.updateCountdownEvery
            let ending;
            if (giveaway.ended === true) {
                return;
            } else if (delay > giveaway.endAt) {
                giveaway.ended = true;
                await this.end.call(this, giveaway.messageID).catch(err => {
                    console.log(err)
                })
                await this._markAsEnded(giveaway.messageID);
                return;
            } else if (delayup > giveaway.endAt) {
                giveaway.ended = true;
                await this.end.call(this, giveaway.messageID).catch(err => {
                    console.log(err)
                })
                await this._markAsEnded(giveaway.messageID);
                return;
            } else if (giveaway.remainingTime < this.options.updateCountdownEvery) {
                giveaway.ended = true;
                await this.end.call(this, giveaway.messageID).catch(err => {
                    console.log(err)
                })
                await this._markAsEnded(giveaway.messageID);
                return;
            }
            return;
        });
        return;
    }
    async _init() {
        this.ready = true;
        this.giveaways = await this._initStorage();
        console.log(`\x1b[32m` + ` \x1b[32mSuccesfully loaded \x1b[33m${this.giveaways.length} \x1b[32mgiveaways` + `\x1b[0m`);
        await setInterval(async () => {
            if (this.client.readyAt) {
                let storageContent = await db.get("giveaways")
                this.giveaways = storageContent;
                await this._checkGiveaway();
            }
        }, 10000);
    }
}
module.exports = GiveawaysManager;