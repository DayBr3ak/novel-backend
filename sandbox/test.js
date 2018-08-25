const feathers = require("@feathersjs/feathers");
const rest = require("@feathersjs/rest-client");
const axios = require("axios");

const app = feathers();

// Connect to a different URL
const restClient = rest("https://novel-backend.herokuapp.com");

// Configure an AJAX library (see below) with that client
app.configure(restClient.axios(axios));

// Connect to the `http://feathers-api.com/messages` service
const bookmarksService = app.service("bookmarks");

const BOOKMARKS = [
  {
    name: "test1"
  },
  {
    name: "test2"
  },
  {
    name: "test3"
  },
  {
    name: "test4"
  },
  {
    name: "test5"
  },
  {
    name: "test6"
  },
  {
    name: "test7"
  }
];

async function createBookmarks() {
  const s = await bookmarksService.create(BOOKMARKS[0]);
  console.log(s);
}

async function run() {
  await createBookmarks();
  const bookmarks = await bookmarksService.find();
  console.log(bookmarks);
}

run().catch(console.error);
