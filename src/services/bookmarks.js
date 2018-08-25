class Bookmarks {
  async find(params) {
    return {
      hello: "world"
    };
  }
}

module.exports = function(app) {
  app.use("bookmarks", new Bookmarks());
};
