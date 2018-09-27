"use strict";

if (process.env.USE_FILE) {
  module.exports = new (require("../utils/fromFile"))("bookmarks");
} else {
  module.exports = new (require("../utils/fromPg"))();
}
