module.exports = function(instance) {
    const { getHelpText } = require('./../../discord-util.js');
	
    let commands = {

    };
	
    let helpText = getHelpText(commands, 'mods');
    return commands;
}
