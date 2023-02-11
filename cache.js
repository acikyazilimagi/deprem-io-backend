const NodeCache = require("node-cache");
const config = require("./config.js");

let cacheInstance;

module.exports = {
  createCacheInstance: function (callback) {
    if (!cacheInstance) {
      cacheInstance = new NodeCache();
      if (config.NODE_ENV === "development") {
        console.log("cache instance created");
      }
    }
  },

  getCache: function () {
    return cacheInstance;
  },
};
