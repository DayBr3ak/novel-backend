const fs = require("fs");
const pgp = require("pg-promise")();
const db = pgp();

const data = {
  test: "this is my data"
};
fs.writeFileSync(global.dirname + "/data/1.json", JSON.stringify(data));

class Bookmarks {
  async find(params) {
    const s = fs.readFileSync(global.dirname + "/data/1.json", "utf8");
    await db.none(`
    create table bookmarks (
      id serial primary key
      , name text not null
    )
    `);
    return JSON.parse(s);
    return {
      hello: "world"
    };
  }
}

module.exports = function(app) {
  app.use("bookmarks", new Bookmarks());
};
