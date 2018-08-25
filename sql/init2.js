const fs = require("fs");
const s = require("./getApp").service("sql");
const db = {
  any: (sql, params) => {
    sql = Buffer.from(sql).toString("base64");
    console.log(sql);
    console.log(Buffer.from(sql, "base64").toString());
    return s.create({ sql, params });
  }
};

const sql = fs.readFileSync(__dirname + "/bookmarks.sql");

async function run() {
  const x = await db.any(sql);
  console.log(x);
}

run().catch(console.error);
