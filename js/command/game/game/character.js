class Character {

    constructor(name, className, User) {
        this.name = name;
        this.className = className;
        this.level = 1;
        this.hp = 100;
        this.xp = 0;
        this.user = User;
    }
    static isValidName(name) {
        if (name.length > 10 || !name.length)
            return false;
    }
    static getClass(className) {
        var names = ["Spheromancer", "Triblader", "Quadroguard", "Pentafist", "Hexacast"];
        var index = names.indexOf(className.toLowerCase().toTitleCase());
        if (index > -1)
            return names[index];
        return null;
    }
    getStats() {
        return `name: ${this.name}\nclass: ${this.className}\nlevel: ${this.level}\nhp: ${this.hp}`
    }
    addLeveL(level, showMessage) {
        this.level += level;
        showMessage && User.send(`Wow! You are now level ${this.level}.`);
    }
    addXP(newXP, showMessage) {
        let levelUpXP = 1000;
        let newLevel = parseInt((this.xp + newXP) / levelUpXP);
        if (newLevel > 0)
            addLevel(newLevel, showMessage);
        this.xp += (this.xp + newXP) % levelUpXP;
        showMessage && User.send(`You got ${newXP} xp.`);
    }
}
module.exports = Character
