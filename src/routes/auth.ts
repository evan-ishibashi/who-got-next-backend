/** Routes for authentication. */

const jsonschema = require("jsonschema");

const Player = require("../models/player");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
import {Request, Response} from 'express';
import { BadRequestError } from "../expressError";

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req:Request, res:Response) {
  const validator = jsonschema.validate(
    req.body,
    userAuthSchema,
    {required: true}
  );
  if (!validator.valid) {
    const errs = validator.errors.map((e:Error) => e.stack);
    throw new BadRequestError(errs);
  }

  const { username, password } = req.body;
  const user = await Player.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req:Request, res:Response) {
  const validator = jsonschema.validate(
    req.body,
    userRegisterSchema,
    {required: true}
  );
  if (!validator.valid) {
    const errs = validator.errors.map((e:Error) => e.stack);
    throw new BadRequestError(errs);
  }

  const newUser = await Player.register({ ...req.body, isAdmin: false });
  const token = createToken(newUser);
  return res.status(201).json({ token });
});


module.exports = router;
