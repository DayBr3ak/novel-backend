const fs = require("fs");
const s = require("./getApp").service("sql");
const db = {
  any: (sql, params) => {
    sql = Buffer.from(sql).toString("base64");
    console.log(sql);
    console.log(Buffer.from(sql, "base64").toString());
    const p = {
      headers: {
        "x-api": "je suis une clé api secrete"
      }
    };
    return s.create(
      {
        sql,
        params
      },
      p
    );
  }
};

const sql = fs.readFileSync(__dirname + "/bookmarks.sql");

async function run() {
  const x = await db.any(sql);
  console.log(x);
}

run().catch(console.error);
