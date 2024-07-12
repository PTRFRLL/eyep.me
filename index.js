const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const UAParser = require("ua-parser-js");
const app = express();
const port = 3000;

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

async function getData(ip, userAgent) {
  const res = await fetch(`http://ip-api.com/json/${ip}?fields=query,country,regionName,city,isp,mobile,status,proxy`);

  if (!res.ok) {
    throw new Error("Error in fetch");
  }
  let lookupFail = false;
  const results = await res.json();
  if (results.status === "fail") {
    lookupFail = true;
  }

  let parser = new UAParser(userAgent);
  let parserResults = parser.getResult();
  const { city, regionName, country, isp, query, mobile, proxy } = results;
  const os = parserResults ? parserResults?.os?.name + " " + parserResults?.os?.version : "Unknown";
  const browser = parserResults?.browser?.name ?? "Unknown browser";

  const data = {
    city,
    regionName,
    country,
    isp,
    query,
    mobile,
    proxy,
    browser,
    os,
    lookupFail,
  };

  return data;
}

app.get("/", async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
