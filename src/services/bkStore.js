"use strict";

if (process.env.USE_FILE) {
  const Store = require("../utils/fromFile");
  const bkStore = new Store("bookmarks");
  module.exports = bkStore;
} else {
  module.exports = new (require("../utils/fromPg"))();
}
