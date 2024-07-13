const express = require("express");
const { getData } = require("../lib/api");
const router = express.Router();

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

router.get("/status", (req, res) => {
  res.json({ status: "success" });
});

module.exports = router;
