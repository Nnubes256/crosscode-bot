const { User } = require('discord.js');

class Character {
    /**
     * 
     * @param {string} name 
     * @param {string} className 
     * @param {User} user 
     */
    constructor(name, className, user) {
        this.name = name;
        this.className = className;
        this.level = 1;
        this.hp = 100;
        this.xp = 0;
        this.money = 0;
        this.user = user;
        this.inPvP = false;
        this.wins = 0;
        this.loses = 0;
    }
    getUser() {
        return this.user;
    }
    toString() {
        return this.name;
    }
    resetHealth() {
        this.hp = 100;
    }
    endPvP() {
        this.inPvP = false;
    }
    startPvP() {
        this.inPvP = true;
    }
    isInPvP() {
        return this.inPvP;
    }
    getStats() {
        let stats = '';
        for (let key in this) {
            if (this.hasOwnProperty(key)) {
                stats += (key + ': ' + this[key] + '\n');
            }
        }
        return stats;
    }
    /**
     * 
     * @param {number} level 
     * @param {boolean} showMessage 
     */
    addLeveL(level, showMessage) {
        this.level += level;
        showMessage && User.send(`Wow! You are now level ${this.level}.`);
    }
    getName() {
        return this.name;
    }
    /**
     * 
     * @param {number} newXP 
     * @param {boolean} showMessage 
     */
    addXP(newXP, showMessage) {
        let levelUpXP = 1000;
        let newLevel = parseInt((this.xp + newXP) / levelUpXP);
        if (newLevel > 0)
            this.addLevel(newLevel, showMessage);
        this.xp += (this.xp + newXP) % levelUpXP;
        showMessage && User.send(`You got ${newXP} xp.`);
    }
    addWin() {
        this.wins += 1;
    }
    addLose() {
        this.loses += 1;
    }
    /**
     * 
     * @param {number} deltaHp 
     */
    changeHp(deltaHp) {
        this.hp += deltaHp;
    }
    getHp() {
        return this.hp;
    }
    isAlive() {
        return this.hp > 0;
    }

    /**
     * 
     * @param {Character} target 
     * @param {string} name 
     */
    attack(target, name) {
        target.changeHp(-20);
        return {
            damage: 20
        };
    }

    /**
     * 
     * @param {string} name 
     * @returns {boolean}
     */
    static isValidName(name) {
        if (!name || name.length > 10 || !name.length)
            return false;
    }

    /**
     * 
     * @param {string} className 
     * @returns {string}
     */
    static getClass(className) {
        if(!className) {
            return;
        }

        const names = ['Spheromancer', 'Triblader', 'Quadroguard', 'Pentafist', 'Hexacast'];
        const lowerClassName = className.toLowerCase();
        return names.find(n => n.toLowerCase() === lowerClassName);
    }
}
exports.Character = Character;