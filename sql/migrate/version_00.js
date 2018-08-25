const from = "0";
const to = "1";

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

  async up() {}

  async down() {}
}

module.exports = Migrate_0;
