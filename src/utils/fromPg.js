"use strict";

const { pgp, db } = require("./pg");

class Store {
  constructor() {
    // this.file = getFile(storeName);
    // fs.ensureFileSync(this.file);

    // this._dirty = true;

    // try {
    //   this._content = JSON.parse(fs.readFileSync(this.file));
    // } catch (e) {
    //   this._content = {};
    // }
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
    await db.none("insert into bks (slug, value) VALUES ($1, $2)", [
      key,
      JSON.stringify(value)
    ]);

    // this._content[key] = value;
    // await fs.writeFile(this.file, JSON.stringify(this._content));
    // this._dirty = true;
    return this;
  }

  async getKey(key) {
    await this._inited;
    const val = await db.oneOrNone("select value from bks where slug = $1", [
      key
    ]);
    return JSON.parse(val.value);
  }

  async deleteKey(key) {
    await this._inited;
    await db.none("delete from bks where slug = $1", [key]);
    return true;
    // if (this._content[key]) {
    //   delete this._content[key];
    //   await fs.writeFile(this.file, JSON.stringify(this._content));
    //   return true;
    // }
    // return false;
  }

  async getAll() {
    await this._inited;
    let tmp = await db.manyOrNone("select value from bks");
    console.log(tmp);
    return tmp.map(x => JSON.parse(x.value)).map(x => [x.slug, s]);

    // let tmp;
    // if (this._dirty) {
    //   tmp = Object.keys(this._content).map(x => [x, this._content[x]]);
    //   this._tmp = tmp;
    //   this._dirty = false;
    // } else {
    //   tmp = this._tmp;
    // }
    // return tmp;
  }
}

module.exports = Store;
