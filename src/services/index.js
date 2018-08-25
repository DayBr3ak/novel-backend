const bookmarks = require("./bookmarks");
const sql = require("./sql");

module.exports = function(app) {
  app.configure(bookmarks);
  app.configure(sql);
};
