const express = require("express");
const { getIPAndUserAgentData } = require("../lib/api");
const { getRecordsByDomain } = require("../lib/dns");
const router = express.Router();

router.get("/", async (req, res) => {
  const userAgent = req.get("user-agent");
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { query, isp, proxy, browser, os, mobile, city, regionName, country, lookupFail } = await getIPAndUserAgentData(
    ip,
    userAgent
  );
  const location = lookupFail ? "Unidentifed" : `${city}, ${regionName}, ${country}`;
  res.json({
    ip,
    location,
    browser,
    os,
    proxy,
    isp,
    mobile,
  });
});

router.get("/dns/:domain", async (req, res) => {
  const domain = req.params.domain;
  try {
    const records = await getRecordsByDomain(domain);
    res.json({ domain, records });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
