const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageEvent extends BaseEvent {
    constructor() {
        super('message');
    }

    async run(client, message) {
        if (message.author.bot) return;
        if (message.content.startsWith(client.prefix)) {
            const cmdArgs = message.content.slice(client.prefix.length).trim().split(/\s+/g);
            const cmdName = cmdArgs.shift().toLowerCase();
            const command = client.commands.get(cmdName) || client.commands.find(x => x.aliases && x.aliases.includes(cmdName));
            if (command) {
                command.init(client, message, cmdArgs);
            }
        }
    }
}