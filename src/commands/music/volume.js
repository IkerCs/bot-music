const BaseCommand = require('../../utils/structures/BaseCommand');

const {
    Message,
    Client
} = require('discord.js');

module.exports = class Volume extends BaseCommand {
    constructor() {
        super('volume', 'music', ['volumen']);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        let queue = client.queue.get(message.guild.id);

        let VoiceChannel = message.member.voice.channel;
        if (!VoiceChannel) return message.channel.send(`:x: | No estas conectado a un canal de voz`);

        if (!queue) return message.channel.send(`:x: | No estoy reproduciendo musica en este momento`);

        let newVolume = args[0];
        let dispatcher = queue.connection.dispatcher;

        if (!newVolume) return message.channel.send(`El volumen actual es de \`${Math.round(dispatcher.volume * 50)}%\``);
        if (isNaN(newVolume)) return message.channel.send(`:x: | El volumen tiene que ser un numero`)
        newVolume = parseInt(newVolume);

        if (newVolume < 101 && 0 < newVolume) {
            await dispatcher.setVolume(Math.min((queue.volume = newVolume / 50)))

            message.channel.send(`El volumen se ha ajustado a \`${Math.round(dispatcher.volume * 50)}%\``);
        } else {
            message.channel.send(`El volumen tiene que estar entre \`1\` y \`100\``)
        }
    }
}