module.exports = function(instance, util) {
    const {
        getHelpText,
        createRichEmbed
    } = util;
    const ModsInfo = new(require('./mods.js'));
    let commands = {
        get: function getMods(msg) {
            msg.channel.send('', ModsInfo.getMods() || createRichEmbed({
                title: 'Mods not Available'
            }));
        },
        installation: function getInstallationGuide(msg) {
            msg.channel.send('', createRichEmbed({
                title: 'Installation guide',
                url: 'https://github.com/CCDirectLink/CCLoader/wiki/Install-mods'
            }));
        }
    };
    let helpText = getHelpText(commands, 'mods');
    return commands;
}
