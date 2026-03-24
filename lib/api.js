const UAParser = require("ua-parser-js");
const logger = require("./logger");
const { providers } = require("./geo");

async function getIPAndUserAgentData(ip, userAgent) {
  let parser = new UAParser(userAgent);
  let parserResults = parser.getResult();
  const os = parserResults ? parserResults?.os?.name + " " + parserResults?.os?.version : "Unknown";
  const browser = parserResults?.browser?.name ?? "Unknown browser";

  let geoData = { lookupFail: true, query: ip };
  for (const provider of providers) {
    try {
      const result = await provider.lookup(ip);
      geoData = { ...result, lookupFail: false };
      break;
    } catch (err) {
      logger.warn(`Geolocation provider "${provider.name}" failed for ${ip}: ${err.message}`);
    }
  }

  return { ...geoData, browser, os };
}

module.exports = { getIPAndUserAgentData };
