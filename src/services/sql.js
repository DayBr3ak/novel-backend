const fs = require("fs");
const { pgp, db } = require("../utils/pg");

class Sql {
  async create(data) {
    const sql = Buffer.from(data.sql, "base64").toString();
    const params = data.params;
    return db.any(sql, params);
  }
}

module.exports = function(app) {
  app.use("sql", new Sql());
};
