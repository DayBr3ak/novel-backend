"use strict";
const fs = require("fs-extra");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const bkStore = require("../services/bkStore");
const router = express.Router();

router.get("/bookmarks", (req, res, next) => {
  bkStore.getAll().then(m => {
    res.json(m);
  });

  // res.json("hello");
});

const check = async ({ slug }) => {
  const res = await axios({
    method: "get",
    url: `http://m.wuxiaworld.co/${slug}/all.html`,
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      Referer: "http://m.wuxiaworld.co/Peerless-Martial-God/",
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "en-US,en;q=0.9,fr;q=0.8"
    }
  });

  // recup le dernier chapter et comparé avec le précédent check
  const html = res.data;
  // fs.writeFileSync(__dirname + "/tmp.html", html);
  const $ = cheerio.load(html);

  if (
    $("title")
      .text()
      .includes("xianxiaworld")
  ) {
    throw {
      status: 404,
      message: "not found " + slug
    };
  }

  const t = Array.prototype.map
    .call($("#chapterlist p a"), x => $(x))
    .filter(x => x.attr("href").includes("html"));

  const lastChapter = t.length;
  let link
  const stored = await bkStore.getKey(slug);
  if (!stored || stored.last < lastChapter) {
    if (stored) {
      // emit event?

      const delta = lastChapter - stored.last;
      // const delta = 1;
      link =
        "http://m.wuxiaworld.co/" +
        slug +
        "/" +
        t[lastChapter - delta - 1].attr("href");
      const domain = process.env.MAILGUN_DOMAIN;
      const recip = process.env.RECIPIENT;
      const apiKey = process.env.MAILGUN_API;
      await axios({
        method: "POST",
        url: "https://api.mailgun.net/v3/" + domain + "/messages",
        auth: {
          username: "api",
          password: apiKey
        },
        params: {
          from: "bkservice@" + domain,
          to: recip,
          subject: `C-${lastChapter} : ${slug}`,
          text: `New chapter(s) since ${stored.updatedAt}\n\n${link}\n`
        }
      }).then(() => console.log("mail sent"));
    }

    return {
      slug,
      before: stored ? stored.last : undefined,
      last: lastChapter,
      link,
      updatedAt: new Date()
    };
  }

  return false;
};
const wait = t => new Promise(r => setTimeout(r, t));

router.post("/bookmarks", async (req, res, next) => {
  try {
    const payload = req.body;
    payload.time = new Date();

    if (req.header("x-secret") !== process.env.SECRET) {
      await wait(Math.random() * 6000 + 2500);
      return res.json({
        message: "ok"
      });
    }

    const val = {
      slug: payload.slug,
      updatedAt: new Date()
    };
    
    const has = await bkStore.getKey(payload.slug);
    if (has) {
      return res.json({
        message: payload.slug + ' already in db',
        updateUi: 0
      });
    }

    const checked = await check(val);
    if (checked) {
      await bkStore.setKey(payload.slug, checked);
      res.json({
        ...checked,
        message: "ok",
        updateUi: 1
      });
    } else {
      res.json({
        message: "nothing to do",
        updateUi: 0
      });
    }
  } catch (e) {
    res.status(e.status || 500).send(e.message);
    console.error(e);
  }
});

router.delete("/bookmarks", async (req, res, next) => {
  try {
    if (!req.body.slug) {
      throw new Error('need body parameter "slug"');
    }

    if (req.header("x-secret") !== process.env.SECRET) {
      await wait(Math.random() * 6000 + 2500);
      return res.json({
        message: "ok"
      });
    }

    const slug = req.body.slug;

    const removed = await bkStore.deleteKey(slug);
    if (removed) {
      res.json({
        slug,
        message: "removed",
        updateUi: 1
      });
    } else {
      res.status(404).json({
        slug,
        message: "not in db",
        updateUi: 0
      });
    }
  } catch (e) {
    res.status(e.status || 500).send(e.message);
    console.error(e);
  }
});

router.get("/bookmarks/refresh", async (req, res, next) => {
  try {
    if (req.header("x-secret") !== process.env.SECRET) {
      console.log("secret faux", req.header("x-secret"));
      await wait(Math.random() * 6000 + 2500);
      return res.json({
        message: "ok",
        updateUi: 0
      });
    }

    const all = await bkStore.getAll();

    const slugs = [];
    for (const x of all) {
      try {
        const slug = x[0];
        console.log("checking", slug);
        const checked = await check({ slug });
        if (checked) {
          await bkStore.setKey(slug, checked);
          slugs.push(checked);
        }
      } catch (e) {
        console.error(e);
        console.log("error ingored");
      }
    }

    res.json({
      message: "ok",
      slugs,
      updateUi: 1
    });
  } catch (e) {
    res.status(e.status || 500).send(e.message);
    console.error(e);
  }
});

module.exports = router;
