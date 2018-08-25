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
  const s = await bookmarksService.create(BOOKMARKS);
  console.log(s);
}

async function cleanup() {
  const bookmarks = await bookmarksService.find();
  for (const b of bookmarks) {
    const s = await bookmarksService.remove(b.id);
    console.log("removed", s);
  }
}

async function run() {
  await createBookmarks();
  const bookmarks = await bookmarksService.find();
  console.log(bookmarks);
  // await cleanup();
}

run().catch(console.error);
