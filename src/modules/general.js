const { Module } = require('../module');

class General extends Module{
    
    /**
     * @returns {{name: string, description: string}[]}
     */
    getHelp() {
        return [
            { name: 'help', description: 'Displays a help about a command' } //Help is hardcoded to Bot
        ];
    }
}

exports.general = new General();