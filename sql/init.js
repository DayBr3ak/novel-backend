const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);
const fs = require("fs");

const sql = {
  bookmarks: fs.readFileSync(__dirname + "/bookmarks.sql")
};

async function run() {
  for (const key in sql) {
    await db.none(sql[key]);
  }
  console.log("postintall end");
}

run().catch(console.error);
