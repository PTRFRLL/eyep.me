const express = require("express");
const { getIPAndUserAgentData } = require("../lib/api");
const router = express.Router();
const pkg = require("../package.json");
const { getRecordsByDomain } = require("../lib/dns");

router.get("/", async (req, res) => {
  const userAgent = req.get("user-agent");
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { query, isp, proxy, browser, os, mobile, city, regionName, country, lookupFail } = await getIPAndUserAgentData(
    ip,
    userAgent
  );
  const location = `${city}, ${regionName}, ${country}`;
  const net = `ISP: ${isp}${proxy ? " (VPN detected)" : ""}`;
  res.render("index", {
    location,
    browser,
    os,
    net,
    mobile,
    query,
    lookupFail,
  });
});

router.get("/dns/:domain", async (req, res) => {
  const domain = req.params.domain;
  try {
    const records = await getRecordsByDomain(domain);
    res.render("dns", { domain, records });
  } catch (error) {
    res.render("dns", { error: error.message });
  }
});

router.get("/status", (req, res) => {
  res.json({ status: "success", version: pkg.version });
});

module.exports = router;
