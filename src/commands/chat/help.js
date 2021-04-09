const BaseCommand = require('../../utils/structures/BaseCommand');

const { Message, Client } = require('discord.js');
const Discord = require('discord.js');

module.exports = class Help extends BaseCommand {
    constructor() {
        super('help', 'bot', ['ayuda', 'commands']);
    }

    /**
     * 
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args 
     */
    async init(client, message, args) {
        
        const Embed = new Discord.MessageEmbed();
        Embed.setColor('36393f');
        Embed.addField('Musica 🎶', client.commands.filter(command => command.category == 'music').map(cmd => `\`${cmd.name}\``).join(', '));
        Embed.addField('Bot 🤖', client.commands.filter(command => command.category == 'bot').map(cmd => `\`${cmd.name}\``).join(', '));

        message.channel.send(Embed)
    }
}