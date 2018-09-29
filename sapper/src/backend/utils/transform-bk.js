"use strict";

function makeChapLink(slug, href) {
  return "http://m.wuxiaworld.co/" + slug + "/" + href;
}

function transformBk(bk) {
  const subLink = bk.chapList[bk.current - 1];
  return {
    ...bk,
    currentLink: makeChapLink(bk.slug, subLink),
    novelLink: makeChapLink(bk.slug, ""),
    chapList: undefined
  };
}

module.exports = {
  makeChapLink,
  transformBk
};
