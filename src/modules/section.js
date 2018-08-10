const fs = require('fs');
const path = require('path');

class Section {
  constructor({cmdManager, name}) {
    this.name = name;
    this.commands = [];
    cmdManager.addSection(this);
  }

  async loadCommands(dir, dep) {
    var cmdDir = path.join(dir, 'command/');
    var cmdFiles = fs.readdirSync(cmdDir);
    for(let cmdFile of cmdFiles) {
      if(cmdFile.endsWith(".js")) {
        var cmdFileAbs = path.join(cmdDir, cmdFile);
        var cmd = require(cmdFileAbs);
        var instance = new cmd(dep);
        await instance.init();
        this.addCommand(instance);
      }
    }
  }
  addCommand(cmd) {
    this.commands.push(cmd);
  }

  findCommand(name) {
    for(let cmd of this.commands) {
      if(cmd.name === name) {
        return cmd;
      }
    }
  }

  equals(name) {
    return this.name === name;
  }

  onMessage(msg, text) {
  }
};
module.exports = Section;
