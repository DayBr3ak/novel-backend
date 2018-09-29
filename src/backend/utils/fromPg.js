"use strict";

const { pgp, db } = require("./pg");

class Store {
  constructor() {
    this._inited = db
      .one("select 1")
      .then(() => {
        console.log("connected to db");
      })
      .catch(e => {
        console.log("cant connect");
        console.error(e.message);
        process.exit(1);
      })
      .then(() => {
        return db
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
      });
  }

  async setKey(key, value) {
    await this._inited;
    const tmp = await this.getKey(key);
    if (tmp) {
      await db.none("update bks set value = $2 where slug = $1", [
        key,
        JSON.stringify(value)
      ]);
    } else {
      await db.none("insert into bks (slug, value) VALUES ($1, $2)", [
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
    return tmp.map(x => JSON.parse(x.value));
  }
}

module.exports = Store;
