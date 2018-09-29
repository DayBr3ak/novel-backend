"use strict";
require("svelte/ssr/register")({
  hydratable: true
});
const svelte = require("svelte");
const fs = require("fs-extra");
const express = require("express");
const Thing = require("./root2.html");

const router = express.Router();
const bkStore = require("../services/bkStore");
const { transformBk } = require("../utils/transform-bk");

const v = {
  values: async function() {
    const all = await bkStore.getAll();

    return all.map(x => transformBk(x[1]));
  }
};

router.get("/dev", async (req, res, next) => {
  try {
    const compiled = Thing.render({
      lines: [
        { slug: "okok", last: 10, currentLink: "??", updatedAt: Date.now() }
      ]
    });
    console.log(compiled);

    const source = await fs.readFile(__dirname + "/root2.html", "utf8");
    const c = svelte.compile(source, {
      hydratable: true
    });

    console.log("-----");
    console.log(c.js);
    await fs.writeFile(__dirname + "/root.svelte.js", c.js.code);

    res.send(compiled.html);
  } catch (e) {
    console.error(e);
    res.sendStatus(e.status || 500);
  }
});

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
