const app = require("./getApp");

async function run() {
  const sql = `select * from bookmarks`;

  const x = await app.service("sql").create({
    sql,
    params: []
  });

  console.log(x);
}

run().catch(console.error);
