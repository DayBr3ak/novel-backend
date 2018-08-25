const fs = require("fs");

const data = {
  test: "this is my data"
};
fs.writeFileSync(global.dirname + "/data/1.json", JSON.stringify(data));

class Bookmarks {
  async find(params) {
    const s = fs.readFileSync(global.dirname + "/data/1.json", "utf8");
    return JSON.parse(s);
    return {
      hello: "world"
    };
  }
}

module.exports = function(app) {
  app.use("bookmarks", new Bookmarks());
};
