module.exports = function(client, util, console) {
    function fetchRoles(obj, args) {
        let roles = [], role;
        let bl = util.getRoleBlacklist();
        let wl = util.getRoleWhitelist();
        for (let arg of args) {
//          console.log(util.discObjFind(obj, arg), " ", arg);
            if ((role = util.discObjFind(obj, arg.trim())) 
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
    function removePending(member) {
       let pendingRole = fetchRole(member.guild.roles, "pending");
         if(member._roles.indexOf(pendingRole.id) > -1) {
            return member.removeRoles([pendingRole]);
         }
       return new Promise(function(resolve,reject) {
         resolve(member);
       });
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
            if(!roles.length) {
              msg.channel.send(`Could not add any new roles.`);
              return;
            }
            msg.member.addRoles(roles).then(function(member) {
              return removePending(member);
            }).then(function(member) {
                if(roles.length) {
                  var newRolesName = getRolesName(roles).join(" ");
                  console.log("Duplicate rows", dupRoles);
                  var dupRolesName = getRolesName(dupRoles).join(" ");
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
        rm: function takeRoles(msg, args) {
            let role = fetchRole(msg.guild.roles, args.join(" "));
            if(role) {
              msg.member.removeRoles([role]).then(function(member) {
                msg.channel.send(`${msg.author} is no longer "${getRolesName([role]).join(" ")}"`);
              }).catch(function(e) {
                msg.channel.send('Encountered an error. Could not remove role.');
                console.log(e);
              });
            }

        }
    };
    return commands;
}
