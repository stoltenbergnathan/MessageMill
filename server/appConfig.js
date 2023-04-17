require("dotenv").config();
const session = require("express-session");
const cors = require("cors");

const expressSession = session({
  secret: process.env.SESSIONSECRET,
  resave: false,
  saveUninitialized: false,
});

const corsConfig = cors({ origin: "*" });

const wrap = (expressMiddleware) => (socket, next) =>
  expressMiddleware(socket.request, {}, next);

module.exports = { expressSession, corsConfig, wrap };
