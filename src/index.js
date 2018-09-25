"use strict";

const compress = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const express = require("express");

const port = process.env.PORT || "3000";

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use("/api", require("./routes/setBookmarks"));
app.use("/", require("./routes/root"));

const server = app.listen(port);

process.on("unhandledRejection", (reason, p) =>
  console.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () => console.log("listening on", port));
