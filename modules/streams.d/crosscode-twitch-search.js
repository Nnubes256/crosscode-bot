const rp = require('request-promise');
/*class CrossCodeDevStream {
    constructor() {
        this.isStreaming = null;
        //TODO:Add DevStream
    }
}*/
const {
    createRichEmbed
} = require('./../../discord-util.js');
class CrossCodeStream {
    constructor() {
        this.list = undefined;
        this.id = undefined;
        var _this = this;
        this.getGameId()
            .then(function() {
                console.log("CrossCode id:", _this.id);
                console.log("Updating list");
                _this.updateList();
            });
        setInterval(this.updateList.bind(this), (1 * 5 * 60 * 1000));
    }
    get() {
        return this.list;
    }
    getGameId() {
        var _this = this;
        return this.makeRequest({
            uri: 'https://api.twitch.tv/helix/games?name=CrossCode'
        }).then(function(response) {
            _this.id = response.data[0].id;
        });
    }
    createRequest(opts) {
        let options = {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID
            },
            json: true
        };
        for (var keys in opts) {
            if (keys !== "headers") {
                options[keys] = opts[keys];
            }
        }
        if (typeof opts.headers === "object") {
            for (var header_value in opts.headers) {
                options.headers[header_value] = opts.headers[header_value];
            }
        }
        return options;
    }
    makeRequest(opts) {
        let options = this.createRequest(opts);
        return rp(options);
    }
    createIdStream(ids_arr) {
        var _copy = JSON.parse(JSON.stringify(ids_arr))
        _copy.forEach(function(id, index, arr) {
            arr[index] = "id=" + id;
        });
        return _copy.join("&");
    }
    generateList(stream_list) {
        var _fields = [];
        if (!stream_list.length) {
            _fields.push({
                name: "",
                value: "No streams currently!"
            });
        } else {
            _fields = stream_list;
        }
        //TODO: FInish this

        this.list = createRichEmbed({
            title: "CrossCode Twitch Streams",
            fields: _fields,
            timestamp: new Date()
        });
    }
    updateList() {
        if (!this.id) {
            console.log("Could not find id");
            return;
        }
        let _this = this;
        var streamData = [];
        this.makeRequest({
            uri: `https://api.twitch.tv/helix/streams?type=live&game_id=${this.id}`
        }).then(function(res) {
            streamData = res.data;
            //TODO: Handle when no streamers
            let streamerIds = res.data.map(function(streamer) {
                return streamer.user_id;
            });
            let ids_list = _this.createIdStream(streamerIds);
            if (ids_list.length) {
                return _this.makeRequest({
                    uri: `https://api.twitch.tv/helix/users?${ids_list}`
                });
            }
            _this.list = null;

        }).then(function(res) {
            //we will assume the result is in the order that they came in...
            var users = res.data;
            var streams_list = [];
            streamData.forEach(function(stream, index) {
                var stream_info = {};
                var user = users[index];
                stream_info.name = `${stream.title} by ${user.display_name}`;
                stream_info.value = `Stream language: ${stream.language}\n[Join Stream](https://www.twitch.tv/${user.login})`;
                streams_list.push(stream_info);
            });
            _this.generateList(streams_list);
        }).catch(function(err) {

        });

    }
}
module.exports = CrossCodeStream
