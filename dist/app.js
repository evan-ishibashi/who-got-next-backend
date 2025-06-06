"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
require("./interface");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
// const companiesRoutes = require("./routes/companies");
// const usersRoutes = require("./routes/users");
// const jobsRoutes = require("./routes/jobs");
const morgan = require("morgan");
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);
app.use("/auth", authRoutes);
// app.use("/companies", companiesRoutes);
// app.use("/users", usersRoutes);
// app.use("/jobs", jobsRoutes);
/** Handle 404 errors -- this matches everything */
app.use(function () {
    throw new NotFoundError();
});
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, res) {
    if (process.env.NODE_ENV !== "test")
        console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: { message, status },
    });
});
module.exports = app;
