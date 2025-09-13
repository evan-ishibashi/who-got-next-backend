"use strict";
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
const db_1 = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError, UnauthorizedError, } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
/** Related functions for users. */
class Player {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/
    static authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // try to find the user first
            const result = yield db_1.db.query(`
        SELECT username,
               password,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               photo_url   AS "photoURL"
        FROM players
        WHERE username = $1`, [username]);
            const user = result.rows[0];
            if (user) {
                // compare hashed password to a new hash from password
                const isValid = yield bcrypt.compare(password, user.password);
                if (isValid === true) {
                    delete user.password;
                    return user;
                }
            }
            throw new UnauthorizedError("Invalid username/password");
        });
    }
    /** Register player with data.
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, password, firstName, lastName, email, photo_url = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png", isAdmin = false }) {
            const duplicateCheck = yield db_1.db.query(`
        SELECT username
        FROM players
        WHERE username = $1`, [username]);
            if (duplicateCheck.rows.length > 0) {
                throw new BadRequestError(`Duplicate username: ${username}`);
            }
            const hashedPassword = yield bcrypt.hash(password, BCRYPT_WORK_FACTOR);
            const result = yield db_1.db.query(`
                INSERT INTO players
                (username,
                 password,
                 first_name,
                 last_name,
                 email,
                 photo_url,
                 is_admin)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                    username,
                    first_name AS "firstName",
                    last_name AS "lastName",
                    email,
                    photo_url AS "photoUrl",
                    is_admin AS "isAdmin"`, [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                photo_url,
                isAdmin,
            ]);
            const player = result.rows[0];
            return player;
        });
    }
    /** Find all players.
     *
     * Returns [{ username, first_name, last_name, email, is_admin }, ...]
     **/
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               is_admin   AS "isAdmin"
        FROM players
        ORDER BY username`);
            return result.rows;
        });
    }
    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, is_admin, jobs }
     *   where jobs is { id, title, company_handle, company_name, state }
     *
     * Throws NotFoundError if user not found.
     **/
    static get(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerRes = yield db_1.db.query(`
        SELECT username,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               is_admin   AS "isAdmin"
        FROM players
        WHERE username = $1`, [username]);
            const player = playerRes.rows[0];
            if (!player)
                throw new NotFoundError(`No user: ${username}`);
            // const userApplicationsRes = await db.query(`
            //     SELECT a.job_id
            //     FROM applications AS a
            //     WHERE a.username = $1`, [username]);
            // user.applications = userApplicationsRes.rows.map(a => a.job_id);
            return player;
        });
    }
    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, isAdmin }
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or make a user an admin.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */
    // static async update(username, data) {
    //   if (data.password) {
    //     data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    //   }
    //   const { setCols, values } = sqlForPartialUpdate(
    //     data,
    //     {
    //       firstName: "first_name",
    //       lastName: "last_name",
    //       isAdmin: "is_admin",
    //     });
    //   const usernameVarIdx = "$" + (values.length + 1);
    //   const querySql = `
    //       UPDATE users
    //       SET ${setCols}
    //       WHERE username = ${usernameVarIdx}
    //       RETURNING username,
    //           first_name AS "firstName",
    //           last_name AS "lastName",
    //           email,
    //           is_admin AS "isAdmin"`;
    //   const result = await db.query(querySql, [...values, username]);
    //   const user = result.rows[0];
    //   if (!user) throw new NotFoundError(`No user: ${username}`);
    //   delete user.password;
    //   return user;
    // }
    /** Delete given user from database; returns undefined. */
    static remove(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield db_1.db.query(`
        DELETE
        FROM players
        WHERE username = $1
        RETURNING username`, [username]);
            const user = result.rows[0];
            if (!user)
                throw new NotFoundError(`No user: ${username}`);
        });
    }
}
module.exports = Player;
