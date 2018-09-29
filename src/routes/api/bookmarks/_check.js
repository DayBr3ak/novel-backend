import axios from "axios";
import cheerio from "cheerio";
import sendMail from "./_sendmail";
import bkStore from "../../../backend/services/bkStore";
import { transformBk, makeChapLink } from "../../../backend/utils/transform-bk";

export default async function check({ slug, noemit = false }) {
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
  let link;
  const stored = await bkStore.getKey(slug);
  if (!stored || stored.last < lastChapter) {
    if (stored && !noemit) {
      // emit event?

      const delta = lastChapter - stored.last;
      // const delta = 1;
      link = makeChapLink(slug, t[lastChapter - delta].attr("href"));
      await sendMail(lastChapter, slug, stored, link);
    }

    return {
      slug,
      before: stored ? stored.last : undefined,
      last: lastChapter,
      chapList: t.map(x => x.attr("href")),
      link,
      current: stored ? stored.current : 1,
      updatedAt: new Date()
    };
  }

  return false;
}
