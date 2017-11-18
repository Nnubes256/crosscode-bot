let rp = require('request-promise');

class CrossCodeStream {
    constructor() {
        this.list = []
        this.list_string = ""
        this.updateList()
    }
    listToString() {
        this.list_string = this.list.reduce(function(str, element) {
            str += '---------------------------------------------------------------' +
                `${element.streamName} by ${element.displayName} (in ${element.language})\n` +
                `${element.streamURL}\n` +
                '---------------------------------------------------------------\n'
        }, "Streaming CrossCode\n")
    }
    getList() {
        return this.list_string;
    }
    updateList() {
        let _instance = this
        rp({
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': process.env.TWITCH_CLIENT_ID
            },
            uri: 'https://api.twitch.tv/kraken/search/streams?query=CrossCode'
        }).then(function(response) {
            let response_json = JSON.parse(response)
            _instance.list = response_json.streams.reduce(function(obj, element) {
                if (element.game === "CrossCode") obj.push({
                    streamURL: element.channel.url,
                    language: element.channel.broadcaster_language,
                    streamName: element.channel.status,
                    displayName: element.channel.display_name
                });
                return obj;
            }, []);
            _instance.listToString()
        });

    }
}
module.exports = CrossCodeStream
