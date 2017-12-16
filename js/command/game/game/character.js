class Character {
    constructor(name, className, User) {
        this.name = name;
        this.className = className;
        this.level = 1;
        this.hp = 100;
        this.xp = 0;
        this.money = 0;
        this.user = User;
        this.inPvP = false;
        this.wins = 0;
        this.loses = 0;
    }
    getUser() {
        return this.user;
    }
    toString() {
        return `${this.name}`;
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
        stats = "";
        for(var key in this) {
            if(this.hasOwnProperty(key) {
                 stats += (key + ": " + this[key] + "\n");
            }
        }
        return stats;
    }
    addLeveL(level, showMessage) {
        this.level += level;
        showMessage && User.send(`Wow! You are now level ${this.level}.`);
    }
    getName() {
        return this.name;
    }
    addXP(newXP, showMessage) {
        let levelUpXP = 1000;
        let newLevel = parseInt((this.xp + newXP) / levelUpXP);
        if (newLevel > 0)
            addLevel(newLevel, showMessage);
        this.xp += (this.xp + newXP) % levelUpXP;
        showMessage && User.send(`You got ${newXP} xp.`);
    }
    addWin() {
        this.wins += 1;
    }
    addLose() {
        this.loses += 1;
    }
    changeHp(deltaHp) {
        this.hp += deltaHp;
    }
    getHp() {
        return this.hp;
    }
    isAlive() {
        return this.hp > 0;
    }
    attack(target, name) {
        target.changeHp(-20);
        return {
            damage: 20
        };
    }
    static isValidName(name) {
        if (name.length > 10 || !name.length)
            return false;
    }
    static getClass(className) {
        var names = ["Spheromancer", "Triblader", "Quadroguard", "Pentafist", "Hexacast"];
        let lowerClassName = className.toLowerCase();
        var index = names.indexOf(lowerClassName[0].toUpperCase() + lowerClassName.substring(1));
        if (index > -1)
            return names[index];
        return null;
    }
}
module.exports = Character
