/** Routes for users. */

const Player = require("../models/player");
const express = require("express");
const router = new express.Router();
import {Request, Response} from 'express';
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /users/:username => { user }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: login
 **/

router.get("/:playerName", ensureLoggedIn, async function (req:Request, res:Response) {
  const player = await Player.get(req.params.playerName);
  return res.json({ player });
});

module.exports = router;
