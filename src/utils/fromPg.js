"use strict";

const { pgp, db } = require("./pg");

class Store {
  constructor() {
    this._inited = db
      .none(
        `
      create table bks (
        slug text primary key
        , value text not null
      )
    `
      )
      .then(() => console.log("created table bks"))
      .catch(() => console.log("bks already exists"));
  }

  async setKey(key, value) {
    await this._inited;
    try {
      await db.none("insert into bks (slug, value) VALUES ($1, $2)", [
        key,
        JSON.stringify(value)
      ]);
    } catch (e) {
      await db.none("update bks set value = $2 where slug = $1", [
        key,
        JSON.stringify(value)
      ]);
    }
    return this;
  }

  async getKey(key) {
    await this._inited;
    const val = await db.oneOrNone("select value from bks where slug = $1", [
      key
    ]);
    if (!val) {
      return undefined;
    }
    return JSON.parse(val.value);
  }

  async deleteKey(key) {
    await this._inited;
    await db.none("delete from bks where slug = $1", [key]);
    return true;
  }

  async getAll() {
    await this._inited;
    let tmp = await db.manyOrNone("select value from bks");
    return tmp.map(x => JSON.parse(x.value)).map(x => [x.slug, x]);
  }
}

module.exports = Store;
