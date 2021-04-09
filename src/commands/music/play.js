const BaseCommand = require('../../utils/structures/BaseCommand');
const config = require('../../../config');

const search = require('youtube-search');
const ytdl = require('ytdl-core');

const { Message, Client } = require('discord.js');
const Discord = require('discord.js');
const humanize_duration = require('humanize-duration');

module.exports = class Play extends BaseCommand {
    constructor() {
        super('play', 'music', ['p']);
    }

    /**
     * 
     * @param {Client} client Discord Client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        const Embed = new Discord.MessageEmbed();
        let queue = client.queue.get(message.guild.id);

        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) return message.channel.send(`:x: | No estas conectado a un canal de voz`)

        let botPermissions = VoiceChannel.permissionsFor(message.guild.id);
        if (!botPermissions.has('CONNECT') || !botPermissions.has('SPEAK')) {
            return message.channel.send(`:x: | No puedo entrar y/o hablar en el canal de voz **${VoiceChannel.name}**`);
        }

        let song = args.join(' ');
        if (!song) return message.channel.send(`:x: | No has especificado que cancion voy a colocar. Ejemplo \`${client.prefix}play despacito\``);
        let resultQuery = await search(song, {
            key: config.api,
            maxResults: 1,
            type: 'video'
        });
        if(!resultQuery.results[0]) return message.channel.send('No se han encontrado resultados')
        let resultURL = resultQuery.results[0].link;
        let info = await ytdl.getInfo(resultURL)

        const songObject = {
            song: {
                title: info.videoDetails.title,
                url: resultURL,
                author: info.videoDetails.author.name,
                thumbnail: info.videoDetails.thumbnails[0].url,
                length: info.videoDetails.lengthSeconds
            },
            message: {
                author: message.author.tag,
                avatar: message.author.displayAvatarURL()
            }
        };

        if(!queue){
            const QueueObject = {
                textChannel: message.channel,
                voiceChannel: VoiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };

            client.queue.set(message.guild.id, QueueObject);
            QueueObject.songs.push(songObject);

            try {
                let connection = await VoiceChannel.join();
                QueueObject.connection = connection;

                Embed.setTitle(songObject.song.title);
                Embed.setDescription(`Duracion: \`${time(songObject.song.length)}\`\nDe: \`${songObject.song.author}\``);
                Embed.setThumbnail(songObject.song.thumbnail);
                message.channel.send(Embed);

                play(message.guild, QueueObject, client);
            } catch (error) {
                console.log(error);
                client.queue.delete(message.guild.id);
                return message.channel.send(`Ha sucedido un error: ${error}`)
            }
        }else{
            queue.songs.push(songObject);
            Embed.setTitle(songObject.song.title);
            Embed.setDescription(`Duracion: \`${time(songObject.song.length)}\`\nDe: \`${songObject.song.author}\``);
            Embed.setThumbnail(songObject.song.thumbnail);
            return message.channel.send(Embed);

        }

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


function play(guild, object, client){
    const queue = client.queue.get(guild.id);
    let song = object.songs[0];
    if(!song){
        client.queue.delete(guild.id);
        object.textChannel.send('Se han terminado las canciones por lo tanto me he retirado del canal de voz');
    }else{
        const dispatcher = queue.connection.play(ytdl(song.song.url));
        dispatcher.on('finish', () => {
            queue.songs.shift();
            play(guild, object, client);
        });
        dispatcher.on('error', (e) => {
            console.log(e);
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 5);
    }
}