// Each provider must implement: lookup(ip) => { query, city, regionName, country, isp, mobile, proxy }
// Throw on failure (network error, bad response, or the provider signals the lookup failed).

const TIMEOUT_MS = 2000;

const providers = [
  {
    name: "ip-api.com",
    async lookup(ip) {
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=query,country,regionName,city,isp,mobile,status,proxy`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status === "fail") throw new Error(data.message ?? "lookup failed");
      return {
        query: data.query,
        city: data.city,
        regionName: data.regionName,
        country: data.country,
        isp: data.isp,
        mobile: data.mobile,
        proxy: data.proxy,
      };
    },
  },
  {
    name: "freeipapi.com",
    async lookup(ip) {
      const res = await fetch(`https://free.freeipapi.com/api/json/${ip}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.ipAddress) throw new Error("lookup failed");
      return {
        query: data.ipAddress,
        city: data.cityName,
        regionName: data.regionName,
        country: data.countryName,
        isp: data.asnOrganization,
        mobile: undefined,
        proxy: data.isProxy,
      };
    },
  },
  {
    name: "ipwho.is",
    async lookup(ip) {
      const res = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message ?? "lookup failed");
      return {
        query: data.ip,
        city: data.city,
        regionName: data.region,
        country: data.country,
        isp: data.connection?.isp,
        mobile: undefined,
        proxy: undefined,
      };
    },
  },
];

module.exports = { providers };
