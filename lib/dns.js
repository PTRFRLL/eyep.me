const { spawn } = require("child_process");
const validator = require("validator");
const logger = require("./logger");
const DNSCache = require("./cache");

const cache = new DNSCache();

function executeDig(domain, recordType) {
  return new Promise((resolve, reject) => {
    const dig = spawn("dig", [domain, recordType, "+short"]);
    let output = "";
    let error = "";

    dig.stdout.on("data", (data) => {
      output += data.toString();
    });

    dig.stderr.on("data", (data) => {
      error += data.toString();
    });

    dig.on("close", (code) => {
      if (code !== 0) {
        reject(error || "Dig command failed");
      } else {
        // Split output into array and remove empty lines
        resolve(output.split("\n").filter((line) => line.trim()));
      }
    });
  });
}

async function getRecordsByDomain(domain) {
  if (!validator.isFQDN(domain)) {
    // FQDN = Fully Qualified Domain Name
    throw new Error(`Invalid domain name ${domain}`);
  }

  if (cache.has(domain)) {
    return cache.get(domain);
  }

  const [aRecords, aaaaRecords, mxRecords, txtRecords, nsRecords, cnameRecords] = await Promise.all([
    executeDig(domain, "A"),
    executeDig(domain, "AAAA"),
    executeDig(domain, "MX"),
    executeDig(domain, "TXT"),
    executeDig(domain, "NS"),
    executeDig(domain, "CNAME"),
  ]);

  // Parse MX records to split priority and server
  const parsedMxRecords = mxRecords.map((record) => {
    const [priority, exchange] = record.split(" ");
    return { priority, exchange };
  });

  const records = {
    a: aRecords,
    aaaa: aaaaRecords,
    mx: parsedMxRecords,
    txt: txtRecords,
    ns: nsRecords,
    cname: cnameRecords,
  };
  cache.set(domain, records);
  return records;
}

module.exports = { getRecordsByDomain };
