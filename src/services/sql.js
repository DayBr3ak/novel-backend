const fs = require("fs");
const { pgp, db } = require("../utils/pg");

class Sql {
  async create(data) {
    const sql = Buffer.from(data.sql, "base64").toString();
    const params = data.params;
    try {
      return await db.any(sql, params);
    } catch (e) {
      return {
        code: e.code,
        message: e.message,
        status: 500
      };
    }
  }
}

module.exports = function(app) {
  app.use("sql", new Sql());
};
