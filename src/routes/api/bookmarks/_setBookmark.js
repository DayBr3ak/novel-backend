import check from "./_check";
import bkStore from "../../../backend/services/bkStore";
import { transformBk } from "../../../backend/utils/transform-bk";

export default async function setBookmark(payload, reply) {
  payload.time = new Date();

  const val = {
    slug: payload.slug,
    updatedAt: new Date()
  };

  const has = await bkStore.getKey(payload.slug);
  if (has) {
    return reply({
      message: payload.slug + " already in db",
      updateUi: 0
    });
  }

  const checked = await check(val);
  if (checked) {
    const bookmark = {
      ...checked
    };
    await bkStore.setKey(payload.slug, bookmark);
    const response = {
      ...transformBk(bookmark),
      message: "ok",
      updateUi: 1
    };
    reply(response);
  } else {
    reply({
      message: "nothing to do",
      updateUi: 0
    });
  }
}
