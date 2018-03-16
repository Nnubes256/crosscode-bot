const fs = require('fs');

export class Config {
    /**
     * 
     * @param {string} path 
     */
    constructor(path) {
        this = JSON.parse(fs.readFileSync(path));
    }
}