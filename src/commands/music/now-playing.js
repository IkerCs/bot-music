const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');
const Discord = require('discord.js');

const humanize_duration = require('humanize-duration');

module.exports = class NowPlaying extends BaseCommand {
    constructor() {
        super('now-playing', 'music', ['np', 'nowplaying']);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        let queue = client.queue.get(message.guild.id);

        if(!queue) return message.channel.send(`:x: | No estoy reproduciendo musica en este momento`);

        let streamTime = Math.trunc(queue.connection.dispatcher.streamTime / 1000);
        const Embed = new Discord.MessageEmbed();
        Embed.setTitle(queue.songs[0].song.title);
        Embed.setDescription(`Duracion total: \`${time(queue.songs[0].song.length)}\`\nTiempo de reproduccion: \`${time(streamTime)}\`\nDe: \`${queue.songs[0].song.author}\``);
        Embed.setThumbnail(queue.songs[0].song.thumbnail);
        Embed.setColor('36393f')
        message.channel.send(Embed)
    }
}

function time(seconds){
    return humanize_duration(seconds * 1000, {
        'conjunction': ' y ',
        'language': 'es',
        'round': true,
        'units': ['h', 'm', 's'],
        'serialComma': false
    });
}