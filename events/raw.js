'use strict';
const Discord = require("discord.js");
module.exports = async (client, packet) => {
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return;
    const channel = await client.channels.cache.get(packet.d.channel_id);
    if (channel.messages.cache.has(packet.d.message_id)) return;
    await channel.messages.fetch(packet.d.message_id).then(async message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = await message.reactions.cache.get(emoji);
        if (reaction) await reaction.users.cache.set(packet.d.user_id, await client.users.cache.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, await client.users.cache.get(packet.d.user_id));
        }
    });
}