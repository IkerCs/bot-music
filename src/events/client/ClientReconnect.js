const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ReconnectEvent extends BaseEvent {
    constructor() {
        super('reconnecting');
    }
    async run(client) {
        console.log(`${client.user.tag} se ha conectado de nuevo a la hora ${new Date().toLocaleDateString()}`);
    }
}