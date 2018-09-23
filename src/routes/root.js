"use strict";
const fs = require("fs");
const express = require("express");

const router = express.Router();
const bkStore = require("../services/bkStore");

const v = {
  values: async function() {
    const all = await bkStore.getAll();

    return all.map(x => x[1]);
  }
};

router.get("/", (req, res, next) => {
  fs.readFile(__dirname + "/root.html", "utf8", (err, html) => {
    const promises = {};

    html = html.replace(/{{(.+)}}/gi, (...args) => {
      const key = args[1];
      if (v[key]) {
        promises[key] = v[key]();
        return args[0];
      } else {
        return key;
      }
    });

    const p2 = {};
    Promise.all(
      Object.keys(promises).map(k => promises[k].then(x => (p2[k] = x)))
    ).then(() => {
      html = html.replace(/{{(.+)}}/gi, (...args) => {
        const key = args[1];

        return JSON.stringify(p2[key]);
      });

      res.send(html);
    });
  });
});

module.exports = router;
