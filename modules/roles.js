module.exports = function(client, util) {
    function fetchRoles(obj, args) {
        let roles = [], role;
        let bl = util.getRoleBlacklist();
        for (let arg of args)
            if ((role = util.discObjFind(obj, arg)) && bl.indexOf(role.id) === -1)
                roles.push(role);
        return roles;
    }
    let commands = {
        add: function giveRoles(msg, args) {
            let roles = fetchRoles(msg.guild.roles, args);
            msg.member.addRoles(roles).catch(console.log);
        },
        rm: function takeRoles(msg, args) {
            let roles = fetchRoles(msg.guild.roles, args);
            msg.member.removeRoles(roles).catch(console.log);
        }
    };
    return commands;
}
