module.exports = function(client, util, config, console) {
    function fetchRoles(obj, args) {
        let roles = [],
            role;
        let bl = util.getRoleBlacklist();
        let wl = util.getRoleWhitelist();
        for (let arg of args) {
            //          console.log(util.discObjFind(obj, arg), " ", arg);
            if ((role = util.discObjFind(obj, arg)) &&
                wl.indexOf(role.id) !== -1 // use whitelist
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
            if (element.name.indexOf("@") == 0)
                return element.name.substring(1);
            return element.name;
        });
    }
    async function removeOtherRolesFromSet(user, rolesToAdd, roleMatched, set) {
        let ret = [];
        for (var i = 0; i < set.length; i++) {
            if (set[i] != roleMatched.id) {
                for (var j = 0; j < rolesToAdd.length; j++) {
                    if (set[i] == rolesToAdd[j].id) {
                        rolesToAdd.splice(j, 1);
                    }
                }
                for (role of user.roles.array()) {
                    if (set[i] == role.id) {
                        ret.push(role.id);
                    }
                }
            }
        }
        await user.removeRoles(ret).then(async (c) => {
            for (var role of c.roles.array()) {
                if (ret.includes(role.id)) {
                    await user.removeRole(role);
                }
            }
        });
    }
    let commands = {
        countMembers: function countAmount(msg, args) {
            var guild = msg.guild;
            var autoRoles = util.getRoles('auto-role', guild);
            var members = guild.members.filter(function(member) {
                return member.roles.has(autoRoles[0].id);
            });
            msg.channel.send(`There are ${members.size} members.`);
        },
        add: async function giveRoles(msg, args) {
            var guild = msg.guild;
            var member = msg.member;

            // users were mentioned
            if (msg.mentions.members.size) {
                if (!util.isFromAdmin(msg)) {
                    msg.reply('You are not an admin');
                    return;
                }
                member = msg.mentions.members.first();
            }
            let roles = fetchRoles(msg.guild.roles, args.join(" ").split(","));
            let dupRoles = [];
            //removes roles the user already has
            for (var role of member.roles.array()) {
                var index = -1;
                if ((index = roles.indexOf(role)) > -1) {
                    dupRoles = dupRoles.concat(roles.splice(index, 1));
                }
            }

            if (roles.length === 0) {
                msg.channel.send(`Could not add any new roles.`);
                return;
            }
            if (!util.hasRoles('auto-role', guild, member, console)) {
                var autoRoles = util.getRoles('auto-role', guild);
                for (let role of autoRoles) {
                    roles.push(role);
                }
            }
            console.log("algo start");

            // Find inputted roles within existing exclusivity sets,
            // and remove the other roles from each set from the users' roles.
            // TODO improve algorithm so it doesn't have O(n^5) complexity
            for (role of roles) {
                for (exclusiveSet of util.getRoles('exclusiveSets', guild)) {
                    for (setRole of exclusiveSet) {
                        if (role.id == setRole) {
                            await removeOtherRolesFromSet(member, roles, role, exclusiveSet);
                        }
                    }
                }
            }

            console.log("algo end");

            member.addRoles(roles).then(function(member) {
                if (roles.length) {
                    var newRolesName = getRolesName(roles).listjoin('and');
                    util.log(msg, `Added ${newRolesName} to ${member}`);
                    var dupRolesName = getRolesName(dupRoles).listjoin('and');
                    var retMessage = `${member} is now ${newRolesName}.`;
                    if (dupRoles.length) {
                        retMessage += `\nAlready had ${dupRolesName}`;
                    }
                    msg.channel.send(retMessage);
                }

            }).catch(function(e) {
                msg.channel.send('There was an error adding a role.');
                console.log(e);
            });
        },
        get: function getRoles(msg) {
            msg.channel.send("```\n" + getRolesName(msg.guild.roles).join("\n") + "```");
        },
        update: function updateList(msg) {
            if (util.isFromAdmin(msg)) {
                console.log("Is an admin");
                util.updateServers(client, console);
                console.log("Updated servers");
                msg.channel.send("Updated successfully").catch(console.error);
            } else {
                console.log("Is not an admin");
            }
        },
        rm: function takeRoles(msg, args) {
            var member = msg.member;

            // users were mentioned
            if (msg.mentions.members.size) {
                if (!util.isFromAdmin(msg)) {
                    msg.reply('You are not an admin');
                    return;
                }
                member = msg.mentions.members.first();
            }
            let role = fetchRoles(msg.guild.roles, args.join(" ").split(","));
            if (role) {
                member.removeRoles(role).then(function(member) {
                    var oldRoles = getRolesName(role).listjoin('or');
                    msg.channel.send(`${member} is no longer ${oldRoles}`);
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
