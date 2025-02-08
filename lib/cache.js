const logger = require("./logger");
class DNSCache {
  constructor() {
    this.cache = new Map();
    this.EXPIRATION_TIME = 60 * 60 * 24 * 1000; // 1 day in milliseconds
  }

  has(key) {
    const cachedData = this.cache.get(key);
    const currentTime = Date.now();

    if (cachedData && currentTime - cachedData.timestamp < this.EXPIRATION_TIME) {
      return true;
    }
    return false;
  }

  get(key) {
    if (this.has(key)) {
      logger.info(`cache hit for ${key}`);
      return this.cache.get(key).records;
    }
    return null;
  }

  set(key, data) {
    this.cache.set(key, { records: data, timestamp: +new Date() });
  }
}

module.exports = DNSCache;
