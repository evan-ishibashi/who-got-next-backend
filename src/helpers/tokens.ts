const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
import '../types/interface';

/** return signed JWT {username, isAdmin} from user data. */

function createToken(player:Player) {
  console.assert(player.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: player.username,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
