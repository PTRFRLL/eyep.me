const express = require("express");
const { getData } = require("../lib/api");
const router = express.Router();
const pkg = require("../package.json");

router.get("/", async (req, res) => {
  const userAgent = req.get("user-agent");
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { query, isp, proxy, browser, os, mobile, city, regionName, country, lookupFail } = await getData(
    ip,
    userAgent
  );
  const location = `${city}, ${regionName}, ${country}`;
  const net = `ISP: ${isp}${proxy ? "(VPN detected)" : ""}`;
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

router.get("/json", async (req, res) => {
  const userAgent = req.get("user-agent");
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const { query, isp, proxy, browser, os, mobile, city, regionName, country, lookupFail } = await getData(
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

router.get("/status", (req, res) => {
  res.json({ status: "success", version: pkg.version });
});

module.exports = router;
