"use strict";
/** Database setup for jobly. */
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
exports.db = void 0;
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");
const databaseUri = getDatabaseUri();
const db = new Client({
    connectionString: databaseUri,
});
exports.db = db;
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        // Jest replaces console.* with custom methods; get the real ones for this
        const { log, error } = require("console");
        try {
            yield db.connect();
            log(`Connected to ${databaseUri}`);
        }
        catch (err) /* istanbul ignore next (ignore for coverage) */ {
            if (err instanceof Error) {
                error(`Couldn't connect to ${databaseUri}`, err.message);
                process.exit(1);
            }
        }
    });
}
connectDb();
