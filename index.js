"use strict";

const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const services = require("./src/services");

const app = express(feathers());
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/", express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());

app.configure(services);

// Configure a middleware for 404s and the error handler
// app.use(express.notFound());

const port = process.env.PORT;
const server = app.listen(port);

process.on("unhandledRejection", (reason, p) =>
  console.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () => console.log("listening on", port));
