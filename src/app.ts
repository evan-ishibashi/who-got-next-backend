const express = require("express");
import {Request, Response} from 'express';
const cors = require("cors");
import { ExpressError } from './expressError'

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const playersRoutes = require("./routes/players");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/players", playersRoutes);
// app.use("/jobs", jobsRoutes);


/** Handle 404 errors -- this matches everything */
app.use(function () {
  throw new NotFoundError();
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err:ExpressError, res:Response) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
