const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);
const fs = require("fs");

const newDbVersion = require("../package.json").db_version;

let currentDbVersion = "0";
try {
  currentDbVersion = require("./db_version.json").db_version;
} catch (e) {}

const sql = {
  bookmarks: fs.readFileSync(__dirname + "/bookmarks.sql")
};

const s = fs
  .readdirSync(__dirname + "/migrate")
  .map(fileName => require(__dirname + "/migrate/" + fileName))
  .map(classes => new classes(db, pgp))
  .sort((a, b) => a.requires() - b.requires())
  .slice();

async function run() {
  if (currentDbVersion === newDbVersion) {
    return;
  }

  const x = s.find(x => x.requires() === currentDbVersion);
  const y = s.find(x => x.gives() === newDbVersion);
  if (!x || !y) {
    throw new Error("no migrations found");
  }
  const ss = s.slice(s.indexOf(x));

  const rollback = [];
  try {
    for (const inst of ss) {
      await inst.up();
      rollback.push(() => inst.down());
    }
    fs.writeFileSync(
      __dirname + "/db_version.json",
      JSON.stringify({
        db_version: newDbVersion
      })
    );
  } catch (e) {
    for (const inst of rollback.reverse()) {
      await inst();
    }
    throw e;
  }
}

// run().catch(console.error);
module.exports = run;
