"use strict";
const fs = require("fs-extra");
const path = require("path");
const rootdir = global.dirname;

const getFile = fName => {
  return path.join(rootdir, "filestore", fName + ".json");
};

class Store {
  constructor(storeName) {
    this.file = getFile(storeName);
    fs.ensureFileSync(this.file);

    this._dirty = true;

    try {
      this._content = JSON.parse(fs.readFileSync(this.file));
    } catch (e) {
      this._content = {};
    }
  }

  async setKey(key, value) {
    this._content[key] = value;
    await fs.writeFile(this.file, JSON.stringify(this._content));
    this._dirty = true;
    return this;
  }

  async getKey(key) {
    return this._content[key];
  }

  async deleteKey(key) {
    if (this._content[key]) {
      delete this._content[key];
      await fs.writeFile(this.file, JSON.stringify(this._content));
      return true;
    }
    return false;
  }

  async getAll() {
    let tmp;
    if (this._dirty) {
      tmp = Object.keys(this._content).map(x => [x, this._content[x]]);
      this._tmp = tmp;
      this._dirty = false;
    } else {
      tmp = this._tmp;
    }
    return tmp;
  }
}

module.exports = Store;
