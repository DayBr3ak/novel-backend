require("dotenv/config");
const feathers = require("@feathersjs/feathers");
const rest = require("@feathersjs/rest-client");
const axios = require("axios");

const app = feathers();

// Connect to a different URL
const restClient = rest("https://novel-backend.herokuapp.com");

// Configure an AJAX library (see below) with that client
app.configure(restClient.axios(axios));
app.hooks({
  before: [
    async function(context) {
      context.params.headers = {
        "x-api": process.env.API_KEY
      };
    }
  ]
});

module.exports = app;
