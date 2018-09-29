import { secretMiddleware, errorMiddleware, getBody } from "./_helpers";
import { transformBk } from "../../../backend/utils/transform-bk";
import bkStore from "../../../backend/services/bkStore";

async function delBookmark(slug, reply) {
  const removed = await bkStore.deleteKey(slug);
  if (removed) {
    reply({
      slug,
      message: "removed",
      updateUi: 1
    });
  } else {
    throw {
      status: 404,
      message: "not in db"
    };
  }
}

export const del = errorMiddleware(
  secretMiddleware(async function del(req, res) {
    let data;
    const reply = r => {
      data = r;
    };
    await delBookmark(req.params.slug, reply);
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
  })
);

const patchBookmark = async (slug, data, reply) => {
  const bk = await bkStore.getKey(slug);

  for (const key of Object.keys(bk)) {
    bk[key] = data[key] ? data[key] : bk[key];
  }

  await bkStore.setKey(slug, bk);
  reply({
    ...transformBk(bk),
    message: "ok",
    updateUi: 1
  });
};

export const patch = errorMiddleware(
  secretMiddleware(async function patch(req, res) {
    const body = await getBody(req);
    console.log("patch", req.params.slug, body);
    let data;
    const reply = r => {
      data = r;
    };
    await patchBookmark(req.params.slug, body, reply);
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
  })
);
