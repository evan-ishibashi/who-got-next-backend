"use strict";
/** Convenience middleware to handle common auth cases in routes. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.ensureLoggedIn = ensureLoggedIn;
exports.ensureAdmin = ensureAdmin;
exports.ensureCorrectUserOrAdmin = ensureCorrectUserOrAdmin;
const config_1 = require("../config");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
    var _a;
    const authHeader = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
    if (authHeader) {
        const token = authHeader.replace(/^[Bb]earer /, "").trim();
        try {
            res.locals.user = jwt.verify(token, config_1.SECRET_KEY);
        }
        catch (err) {
            /* ignore invalid tokens (but don't store user!) */
        }
    }
    return next();
}
/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(res, next) {
    var _a;
    if ((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.username)
        return next();
    throw new UnauthorizedError();
}
/** Middleware to use when they be logged in as an admin user.
 *
 *  If not, raises Unauthorized.
 */
function ensureAdmin(res, next) {
    var _a, _b;
    if (((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.username) && ((_b = res.locals.user) === null || _b === void 0 ? void 0 : _b.isAdmin) === true) {
        return next();
    }
    throw new UnauthorizedError();
}
/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */
function ensureCorrectUserOrAdmin(req, res, next) {
    var _a;
    const user = res.locals.user;
    const username = (_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.username;
    if (username && (username === req.params.username || user.isAdmin === true)) {
        return next();
    }
    throw new UnauthorizedError();
}
