const bookmarks = require("./bookmarks");

module.exports = function(app) {
  app.configure(bookmarks);
};
