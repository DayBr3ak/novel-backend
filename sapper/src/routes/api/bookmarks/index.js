import bkStore from "../../../backend/services/bkStore";
import { transformBk } from "../../../backend/utils/transform-bk";
import { secretMiddleware, getBody, errorMiddleware } from "./_helpers";
import setBookmark from "./_setBookmark";

export const get = errorMiddleware(async function get(req, res) {
  const m = await bkStore.getAll();
  const m2 = m.map(x => transformBk(x));
  console.log(m2);

  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.end(JSON.stringify(m2));
});

export const post = errorMiddleware(
  secretMiddleware(async function post(req, res) {
    const body = await getBody(req);
    if (!body.slug || !body.slug.length) {
      const e = new Error('Body parameter "slug" missing or empty');
      e.status = 400;
      throw e;
    }

    let data = { default: "no reply" };
    await setBookmark(body, reply => {
      data = reply;
    });

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
  })
);
