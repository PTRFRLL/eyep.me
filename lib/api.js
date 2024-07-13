const UAParser = require("ua-parser-js");
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

module.exports = { getData };
