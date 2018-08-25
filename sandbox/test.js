const assert = require("assert");
const app = require("./getApp");

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
}

async function cleanup() {
  // const bookmarks = await bookmarksService.find();
  // for (const b of bookmarks) {
  //   const s = await bookmarksService.remove(b.id);
  //   console.log("removed", s);
  // }

  const s = await bookmarksService.remove(0, {
    query: {
      all: true
    }
  });
}

async function run() {
  await createBookmarks();
  const bookmarks = await bookmarksService.find();
  console.log(bookmarks);
  await cleanup();
}

async function testPatch() {
  await cleanup();
  const s = await bookmarksService.create({
    name: "patch fail",
    reference: "ok"
  });
  const e = await bookmarksService.patch(s.id, {
    name: "patch ok"
  });
  assert.equal(s.id, e.id);
  assert.equal(e.name, "patch ok");
}

testPatch().catch(console.error);
