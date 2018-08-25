const from = "1";
const to = "2";

class Migrate_0 {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
  }

  requires() {
    return from;
  }

  gives() {
    return to;
  }

  up() {
    return this.db.none(`
    alter table bookmarks add column reference text not null;
    `);
  }

  down() {}
}

module.exports = Migrate_0;
