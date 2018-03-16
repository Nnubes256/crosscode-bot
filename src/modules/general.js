const { Module } = require('../module');

class General extends Module{
    
    /**
     * @returns {{name: string, desciption: string}[]}
     */
    getHelp() {
        return [
            { name: 'help', desciption: 'Displays a help about a command' } //Help is hardcoded to Bot
        ];
    }
}

exports.general = new General();