const rp = require('request-promise');



module.exports = class CrossCodeStream {
    constructor() {
        this.ccStreamers = new Map();
        this.gameId = undefined;
    }
    async init(console) {
        await this._getGameId();
        this._updateList();
        // updates every 2 minutes
        setInterval(this._updateList.bind(this), (1 * 2 * 60 * 1000));
    }

    getStreamers() {
      return this.ccStreamers;
    }

    _createIdStream(idsArr) {
        var copy = JSON.parse(JSON.stringify(idsArr));
        return copy.map((id) => `id=${id}`)
                 .join("&");
    }
    async _updateList() {
        if (!this.gameId) {
            console.error("Could not find Game Id.");
            return;
        }
        var streamData = await this._getStreams();
        if(!streamData.length)
          return;

        let streamerIds = streamData.map(function(streamer) {
            return streamer.user_id;
        });

        this.ccStreamers.deleteNotIn(streamerIds);

        var users = await this._getTwitchUsersByIds(streamerIds);
        users.forEach(function(user, index) {
            var stream = streamData[index];
            var streamObject = {
              title : stream.title,
              user : {
                id : user.id,
                display_name : user.display_name,
                login : user.login,
              },
              start : stream.started_at,
              language : stream.language
            };
            this.ccStreamers.set(user.id, streamObject);
        }.bind(this));

    }
    async _getGameId() {
        var {data} = await makeRequest({
            uri: 'https://api.twitch.tv/helix/games?name=CrossCode'
        });
        this.gameId = data[0].id;
        return;
    }

    async _getStreams() {
      var streamData = [];
      var response = await makeRequest({
          uri: `https://api.twitch.tv/helix/streams?type=live&game_id=${this.gameId}`
      });
      return response.data;
    }

    async _getTwitchUsersByIds(ids) {

        let idsList = this._createIdStream(ids);
        var response = await makeRequest({
            uri: `https://api.twitch.tv/helix/users?${idsList}`
          });
        return response.data;
    }
}


Map.prototype.deleteNotIn = function(arr) {
	var notIn = [...this.keys()]
                 .filter((e) => arr.indexOf(e) === -1);
    notIn.forEach(function(key) {
        this.delete(key);
     }.bind(this));
}

// things to never look at again
function createRequest(opts) {
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
function makeRequest(opts) {
  return rp(createRequest(opts));
}
