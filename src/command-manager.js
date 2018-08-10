const fs = require('fs');
const path = require('path');

 class CommandManager {
  constructor() {
    this.sections = [];
    this.dependencies = {};
  }

  async init() {
    var files = fs.readdirSync(path.join(__dirname, 'modules'));
    var instances = [];
    for(var file of files) {
      if(file === "art") {
        var moduleRequire = require(path.join(__dirname, 'modules', file, 'section.js'));
        var instance = new moduleRequire(this.getDependencies());
      }
    }
  }

  addDependency(name, dependencies) {
    this.dependencies[name] = dependencies;
  }

  getDependencies() {
    return this.dependencies;
  }

  addSection(cmd) {
    this.sections.push(cmd);
  }
  findSection(name) {
    for(let section of this.sections) {
      if(section.equals(name)) {
        return section;
      }
    }
    return null;
  }
  onMessage(msg, text) {
      const regexSectionName = /^(.*?)\s/;
      let sectionName = text.match(regexSectionName)[1];
      let section = this.findSection(sectionName);
      if(section) {
        section.onMessage(msg, text
                             .replace(sectionName, "")
                             .trim());
      }
  }
}
module.exports = CommandManager;
