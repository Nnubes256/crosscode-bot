const rp = require('request-promise');

const { Utils } = require('../../utils');
const { Env } = require('../../env');

class CrossCodeStream {
    constructor() {
        this.getGameId()
            .then(() => {
                console.log('CrossCode id:', this.id);
                console.log('Updating list');
                this.updateList();
            })
            .catch(err => console.error(err));
        setInterval(this.updateList.bind(this), (1 * 5 * 60 * 1000));
    }
    get() {
        return this.list;
    }
    getGameId() {
        return this.makeRequest({
            uri: 'https://api.twitch.tv/helix/games?name=CrossCode'
        }).then(response => {
            /** @type {string} */
            this.id = response.data[0].id;
        });
    }
    createRequest(opts) {
        const options = {
            headers: {
                'Client-ID': Env.TWITCH_CLIENT_ID
            },
            json: true
        };
        for (let keys in opts) {
            if (keys !== 'headers') {
                options[keys] = opts[keys];
            }
        }
        if (typeof opts.headers === 'object') {
            for (let header_value in opts.headers) {
                options.headers[header_value] = opts.headers[header_value];
            }
        }
        return options;
    }
    makeRequest(opts) {
        return rp(this.createRequest(opts));
    }
    /**
     * 
     * @param {string[]} ids_arr 
     */
    createIdStream(ids_arr) {
        /** @type {string[]} */
        const copy = JSON.parse(JSON.stringify(ids_arr));
        copy.forEach((id, index, arr) => {
            arr[index] = 'id=' + id;
        });
        return copy.join('&');
    }
    /**
     * 
     * @param {{name: string, value: string}[]} stream_list 
     */
    generateList(stream_list) {
        if (!stream_list.length) {
            this.list = null;
            return;
        }
        //TODO: Finish this

        this.list = Utils.createRichEmbed({
            title: 'CrossCode Twitch Streams',
            fields: stream_list,
            timestamp: new Date()
        });
    }
    updateList() {
        if (!this.id) {
            console.log('Could not find id');
            return;
        }
        let streamData = [];
        this.makeRequest({
            uri: `https://api.twitch.tv/helix/streams?type=live&game_id=${this.id}`
        }).then(res => {
            streamData = res.data;
            //TODO: Handle when no streamers
            /** @type {string[]} */
            const streamerIds = res.data.map(streamer => streamer.user_id);
            const ids_list = this.createIdStream(streamerIds);
            if (ids_list.length) {
                return this.makeRequest({
                    uri: `https://api.twitch.tv/helix/users?${ids_list}`
                });
            }
            this.list = null;

        }).then(res => {
            //we will assume the result is in the order that they came in...
            const users = res.data;
            /** @type {{name: string, value: string}[]} */
            const streams_list = [];
            streamData.forEach((stream, index) => {
                const user = users[index];
                streams_list.push({
                    name: `${stream.title} by ${user.display_name}`,
                    value: `Stream language: ${stream.language}\n[Join Stream](https://www.twitch.tv/${user.login})`
                });
            });
            this.generateList(streams_list);
        }).catch(err => console.error(err));

    }
}
exports.CrossCodeStream = CrossCodeStream;