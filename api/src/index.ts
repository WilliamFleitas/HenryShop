import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index";
import morgan from "morgan";
import cookieSession from "cookie-session";
const passport = require('passport');
require('./passport');

dotenv.config();
export const server = express();
const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;

require("./mongo");
server.use(express.json());
server.use(morgan("dev"));

//Admitir llamados del front
server.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use(cookieSession({
  name: "Session",
  keys: ["HenryShop"],
  maxAge: 24*60*60^100,
}));

server.use(passport.initialize());
server.use(passport.session());

server.use("/", routes);

server.listen(PORT, () => {
  console.log(`Server Listening on port ${PORT}`);
});
