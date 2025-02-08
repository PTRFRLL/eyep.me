const logger = require("../lib/logger");

const requestLogger = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  res.on("finish", () => {
    let request = `${req.method} ${res.statusCode} - ${ip} ${req.originalUrl}`;
    logger.info(request);
  });

  next();
};

module.exports = requestLogger;
