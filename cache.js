const NodeCache = require('node-cache');

let cacheInstance;

module.exports = {
  createCacheInstance: function (callback) {
    if (!cacheInstance) {
      cacheInstance = new NodeCache();
      console.log('cache instance created');
    }
  },

  getCache: function () {
    return cacheInstance;
  },
};
