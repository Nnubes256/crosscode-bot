const { Character } = require('./character');
const { Channel } = require('discord.js');

class Match {
    /**
     * 
     * @param {Character} player1 
     * @param {Character} player2 
     * @param {Channel} channel 
     */
    constructor(player1, player2, channel) {
        this.players = [player1, player2];
        this.turn = 0;
        this.channel = channel;
    }
    startMatch() {
        for (let player of this.players) {
            player.startPvp();
        }
    }
    hasWinner() {
        for (let player of this.players) {
            if (!player.isAlive())
                return true;
        }
        return false;
    }
    getMatchResult() {
        /** @type {{winners: Character[], losers: Character[]}} */
        const result = {
            winners: [],
            losers: []
        };
        for (let player of this.players) {
            if (player.isAlive()) {
                result.winners.push(player);
            } else {
                result.losers.push(player);
            }

        }
        return result;
    }
    endMatch() {
        if (this.hasWinner()) {
            const {
                winners,
                losers
            } = this.getMatchResult();
            for (let player of winners) {
                player.addWin();
            }
            for (let player of losers) {
                player.addLose();
            }
            this.channel.send(`Winners: ${winners.join(' ')}\nLosers: ${losers.join(' ')}`);
        }
        for (let player of this.players) {
            player.endPvP();
            player.resetHealth();
        }
    }
    nextTurn() {
        this.turn = (this.turn + 1) % this.players.length;
    }
    /**
     * 
     * @param {number} id 
     * @returns {Character}
     */
    findPlayer(id) {
        return this.players.find(p => p.getUser().id === id);
    }
    /**
     * 
     * @param {Character} member 
     */
    isTurn(member) {
        return this.players[this.turn] === member;
    }
    getTurnName() {
        return this.players[this.turn].getName();
    }
    /**
     * 
     * @param {Character} target 
     * @param {string} attackName 
     */
    attackSequence(target, attackName) {
        const playerTurn = this.players[this.turn];
        const playerName = playerTurn.getName();
        const targetName = target.getName();
        const attackInfo = playerTurn.attack(target, attackName);
        this.channel.send(`${playerName} attacks ${targetName}. \n${targetName} recieves ${attackInfo.damage}`);
    }
}
exports.Match = Match;