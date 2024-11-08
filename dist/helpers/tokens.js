"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
require("../interface");
/** return signed JWT {username, isAdmin} from user data. */
function createToken(player) {
    console.assert(player.isAdmin !== undefined, "createToken passed user without isAdmin property");
    let payload = {
        username: player.username,
        isAdmin: player.isAdmin || false,
    };
    return jwt.sign(payload, SECRET_KEY);
}
module.exports = { createToken };
