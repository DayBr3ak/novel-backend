const fs = require("fs");
const pgp = require("pg-promise")();
const db = pgp(process.env.DATABASE_URL);

const data = {
  test: "this is my data"
};
fs.writeFileSync(global.dirname + "/data/1.json", JSON.stringify(data));

class Bookmarks {
  async find(params) {
    return db.manyOrNone("select * from bookmarks");
  }

  async create(data, params) {
    return db.one(
      "insert into bookmarks ($1:name) values ($1:csv) returning *",
      [data]
    );
  }

  async get(id, params) {
    return db.oneOrNone("select * from bookmarks where id = $1", [id]);
  }

  async remove(id, params) {
    return db.oneOrNone("drop from bookmarks where id = $1", [id]);
  }

  async patch(id, data, params) {}

  async update(id, data, params) {}
}

module.exports = function(app) {
  app.use("bookmarks", new Bookmarks());
};
