let rp = require('request-promise');
class StrawPoll {
    constructor(title, options) {
        this.title = title;
        this.options = options;
    }
    makeRequest() {
        let newRequest = {
            uri: this.endpoint,
            header: {
                "Content-Type": "application/json"
            },
            body: {},
            json: true
        };
        if (!this.title) {
            return new Promise(function(resolve, reject) {
                reject('No title specified');
            })
        }
        newRequest.body.title = this.title;
        if (!Array.isArray(this.options) || this.options.length < 2) {
            return new Promise(function(resolve, reject) {
                reject('Options must have at least two choices.');
            })
        }
        newRequest.body.options = this.options;
        return rp(options);
    }
}
StrawPoll.prototype.endpoint = 'https://strawpoll.me/api/v2'
module.exports = StrawPoll