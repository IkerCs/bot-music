const BaseCommand = require('../../utils/structures/BaseCommand');
const config = require('../../../config');

const search = require('youtube-search');
const ytdl = require('ytdl-core');

const { Message, Client } = require('discord.js');
const Discord = require('discord.js');
const humanize_duration = require('humanize-duration');

module.exports = class Skip extends BaseCommand {
    constructor() {
        super('skip', 'music', ['saltar']);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        const Embed = new Discord.MessageEmbed();
        let queue = client.queue.get(message.guild.id);

        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) return message.channel.send(`:x: | No estas conectado a un canal de voz`)

        if(!queue) { /* En caso de que no haya canciones reproduciendose en ese mismo momento ejecutar el comando de play en lugar del comando skip */
            return require('./play').prototype.init(client, message, args) 
        }

        await queue.connection.dispatcher.end();
        Embed.setTitle(queue.songs[0].song.title);
        Embed.setDescription(`Duracion: \`${time(queue.songs[0].song.length)}\`\nDe: \`${queue.songs[0].song.author}\``);
        Embed.setThumbnail(queue.songs[0].song.thumbnail);
        message.channel.send(Embed);
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