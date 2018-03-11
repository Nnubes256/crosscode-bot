module.exports = function(client, util, console) {
    function fetchRoles(obj, args) {
        let roles = [], role;
        let bl = util.getRoleBlacklist();
        let wl = util.getRoleWhitelist();
        for (let arg of args) {
//          console.log(util.discObjFind(obj, arg), " ", arg);
            if ((role = util.discObjFind(obj, arg))
              && wl.indexOf(role.id) !== -1 // use whitelist
//              && bl.indexOf(role.id) === -1 // use blacklist
            )
              roles.push(role);
        }
        return roles;
    }
    function fetchRole(roles, roleName) {
      return util.discObjFind(roles, roleName);
    }
    function getRolesName(roles) {
      return roles.map(function(element) {
           if(element.name.indexOf("@") == 0)
                 return element.name.substring(1);
           return element.name;
        });
    }
    let commands = {
        add: function giveRoles(msg, args) {
            let roles = fetchRoles(msg.guild.roles, args.join(" ").split(","));
            let dupRoles = [];
            //removes roles the user already has
            for(var role of msg.member.roles.array()) {
              var index = -1;
              if((index = roles.indexOf(role)) > -1) {
                dupRoles = dupRoles.concat(roles.splice(index, 1));
              }
            }
            if(roles.length === 0) {
              msg.channel.send(`Could not add any new roles.`);
              return;
            }
            
            msg.member.addRoles(roles).then(function(member) {
              if(util.hasPending(msg)) {
                return util.removePending(msg, console);
              }
              return member;
            }).then(function(member) {
                if(roles.length) {
                  var newRolesName = getRolesName(roles).listjoin('and');
                  util.log(msg, `Added ${newRolesName} to ${member}`);
                  var dupRolesName = getRolesName(dupRoles).listjoin('and');
                  var retMessage = `${msg.author} is now ${newRolesName}.`;
                  if(dupRoles.length) {
                    retMessage += `\nAlready had ${dupRolesName}`;
                  }
                  msg.channel.send(retMessage);
                }

            }).catch(function(e) {
              msg.channel.send('Encountered an error. Could not add role.');
              console.log(e);
            });
        },
        get : function getRoles(msg) {
          msg.channel.send("```\n" + getRolesName(msg.guild.roles).join("\n") + "```");
        },
        update : function updateList(msg) {
          if(util.isFromAdmin(msg)) {
            console.log("Is an admin");
            util.updateServers(client, console);
            console.log("Updated servers");
            msg.channel.send("Updated successfully").catch(console.error);
          } else {
            console.log("Is not an admin");
          }
        },
        rm: function takeRoles(msg, args) {
            let role = fetchRoles(msg.guild.roles, args.join(" ").split(","));
            if(role) {
              msg.member.removeRoles(role).then(function(member) {
                var oldRoles = getRolesName(role).listjoin('or');
                msg.channel.send(`${msg.author} is no longer ${oldRoles}`);
                util.log(msg, `Removed ${oldRoles} from ${member}`);
              }).catch(function(e) {
                msg.channel.send('Encountered an error. Could not remove role.');
                console.log(e);
              });
            }

        }
    };
    return commands;
}
