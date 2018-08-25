const fs = require("fs");
const { pgp, db } = require("../utils/pg");

class Sql {
  async create(data) {
    const sql = data.sql;
    const params = data.params;
    return db.any(sql, params);
  }
}

module.exports = function(app) {
  app.use("sql", new Sql());
};
