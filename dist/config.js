"use strict";
/** Shared config for application; can be required many places. */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCRYPT_WORK_FACTOR = exports.PORT = exports.SECRET_KEY = void 0;
exports.getDatabaseUri = getDatabaseUri;
require("dotenv").config();
require("colors");
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
exports.SECRET_KEY = SECRET_KEY;
const PORT = process.env.PORT || 3001;
exports.PORT = PORT;
// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "postgresql:///who-got-next_test"
        : process.env.DATABASE_URL || "postgresql:///who-got-next";
}
// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;
exports.BCRYPT_WORK_FACTOR = BCRYPT_WORK_FACTOR;
if (process.env.NODE_ENV !== "test") {
    console.log(`
${"Jobly Config:"}
${"NODE_ENV:"}           ${process.env.NODE_ENV}
${"SECRET_KEY:"}         ${SECRET_KEY}
${"PORT:"}               ${PORT}
${"BCRYPT_WORK_FACTOR:"} ${BCRYPT_WORK_FACTOR}
${"Database:"}           ${getDatabaseUri()}
---`);
}