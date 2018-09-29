"use strict";

let bkStore;
if (process.env.USE_FILE) {
  bkStore = new (require("../utils/fromFile"))("bookmarks2");
} else {
  bkStore = new (require("../utils/fromPg"))();
}

console.log(bkStore);
export default bkStore;
