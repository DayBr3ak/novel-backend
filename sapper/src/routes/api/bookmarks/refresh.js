import bkStore from "../../../backend/services/bkStore";
import { transformBk } from "../../../backend/utils/transform-bk";
import { secretMiddleware, errorMiddleware } from "./_helpers";
import check from "./_check";

const doRefresh = async reply => {
  const all = await bkStore.getAll();

  const slugs = [];
  for (const { slug } of all) {
    try {
      console.log("checking", slug);
      const checked = await check({ slug });
      console.log("...done", slug);
      if (checked) {
        await bkStore.setKey(slug, checked);
        slugs.push(transformBk(checked));
      }
    } catch (e) {
      console.error(e);
      console.log("error ignored");
    }
  }

  reply({
    message: "ok",
    slugs,
    updateUi: 1
  });
};

export const get = errorMiddleware(
  secretMiddleware(async function get(req, res) {
    let data;
    const reply = r => {
      data = r;
    };
    console.log("in refresh");
    await doRefresh(reply);

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify(data));
  })
);
