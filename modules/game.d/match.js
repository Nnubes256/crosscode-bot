class Match {
    constructor(player1, player2, channel) {
        this.players = [];
        this.players.push(player1);
        this.players.push(player2);
        this.turn = 0;
        this.channel = channel;
    }
    startMatch() {
        this.players.forEach(function(element) {
            element.startPvp();
        })
    }
    hasWinner() {
        for (let player of this.players) {
            if (!player.isAlive())
                return true;
        }
        return false;
    }
    getMatchResult() {
        let result = {
            winners: [],
            losers: []
        }
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
            let {
                winners,
                losers
            } = this.getMatchResult();
            winners.forEach(function(player) {
                player.addWin();
            })
            losers.forEach(function(player) {
                player.addLose();
            })
            this.channel.send(`Winners:${winners.join(' ')}\nLosers:${losers.join(' ')}`);
        }
        this.players.forEach(function(element) {
            element.endPvP();
            element.resetHealth();
        })
    }
    nextTurn() {
        this.turn = (this.turn + 1) % this.players.length;
    }
    findPlayer(id) {
        for (let player of this.players) {
            if (player.getUser().id === id)
                return player;
        }
        return null;
    }
    isTurn(member) {
        return this.players[this.turn] === member;
    }
    getTurnName() {
        return this.players[this.turn].getName();
    }
    attackSequence(target, attackName) {
        let playerTurn = this.players[this.turn];
        let playerName = playerTurn.getName();
        let targetName = target.getName();
        let attackInfo = playerTurn.attack(target, attackName);
        this.channel.send(`${playerName} attacks ${targetName}. \n${targetName} recieves ${attackInfo.damage}`);
    }
}
module.exports = Match