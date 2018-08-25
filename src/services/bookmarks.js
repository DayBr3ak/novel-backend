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

  _create(data) {
    return db.one("insert into bookmarks($1:name) values($2:csv) returning *", [
      Object.keys(data),
      data
    ]);
  }

  async create(data, params) {
    if (data instanceof Array && data.length) {
      return Promise.all(data.map(this._create.bind(this)));
    }
    return this._create(data);
  }

  async get(id, params) {
    return db.oneOrNone("select * from bookmarks where id = $1", [id]);
  }

  async remove(id, params) {
    if (params.query.all) {
      return db.manyOrNone("delete from bookmarks where id > -1 returning *");
    }
    if (
      params.query.id &&
      params.query.id instanceof Array &&
      params.query.id.length > 0
    ) {
      return db.manyOrNone(
        "delete from bookmarks where id = ANY($1) returning *",
        [params.query.id]
      );
    }

    return db.oneOrNone("delete from bookmarks where id = $1 returning *", [
      id
    ]);
  }

  async patch(id, data, params) {
    return db.oneOrNone(
      "update bookmarks set ($1:raw) where id = $2 returning *",
      [pgp.helpers.sets(data), id]
    );
  }
}

module.exports = function(app) {
  app.use("bookmarks", new Bookmarks());
};
