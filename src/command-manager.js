export default class CommandManager {
  constructor() {
    this.commands = [];
  }
  addCommand(cmd) {
    this.commands.push(cmd);
  }
  findCommand(name) {
    for(var cmd of this.commands) {
      if(cmd.equals(name)) {
        return cmd;
      }
    }
    return null;
  }
  onMessage(msg, text) {
      const getCmdName = /\s?(.*)\s?/;
      let cmdName = text.getCmdName("")[1];
      let cmd = this.findCommand(cmdName);
      if(cmd) {
        cmd.onMessage(msg, text
                             .trim()
                             .replace(cmdName, ""));
      }
  }
}
