const PERMISSIONS = require("./permission.js");
const ROLES = require("./role.js");

module.exports = {
  [ROLES.ADMIN]: [
    PERMISSIONS.ALL,
    // PERMISSIONS.USER_CREATE,
    // PERMISSIONS.USER_UPDATE,
    // PERMISSIONS.USER_DELETE,
    // PERMISSIONS.POST_READ,
    // PERMISSIONS.POST_DELETE,
  ],
};
