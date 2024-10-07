"use strict";
/** Routes for authentication. */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const expressError_1 = require("../expressError");
/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/token", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = jsonschema.validate(req.body, userAuthSchema, { required: true });
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new expressError_1.BadRequestError(errs);
        }
        const { username, password } = req.body;
        const user = yield User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    });
});
/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/register", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = jsonschema.validate(req.body, userRegisterSchema, { required: true });
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new expressError_1.BadRequestError(errs);
        }
        const newUser = yield User.register(Object.assign(Object.assign({}, req.body), { isAdmin: false }));
        const token = createToken(newUser);
        return res.status(201).json({ token });
    });
});
module.exports = router;
