module.exports = function(instance) {
    let {
        getHelpText
    } = require('./../../discord-util.js')
    let commands = {

    };
    let helpText = getHelpText(commands, 'mods');
    return commands;
}
