const logger = require("../lib/logger");

const requestLogger = (req, res, next) => {
  res.on("finish", () => {
    let request = `${req.method} ${res.statusCode} - ${req.ip} ${req.originalUrl}`;
    logger.info(request);
  });

  next();
};

module.exports = requestLogger;
