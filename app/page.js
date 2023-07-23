import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

async function getData() {
  const head = headers();
  const ip = head.get("x-real-ip") ?? head.get("x-forwarded-for");
  const userAgent = head.get("user-agent");
  const res = await fetch(`http://ip-api.com/json/${ip}?fields=query,country,regionName,city,isp,mobile,status,proxy`);

  let parser = new UAParser(userAgent);
  let parserResults = parser.getResult();

  if (!res.ok) {
    throw new Error("Error in fetch");
  }

  const { city, regionName, country, isp, query, mobile } = await res.json();

  const data = {
    city,
    regionName,
    country,
    isp,
    query,
    mobile,
    browser: parserResults.browser.name,
    os: parserResults.os.name + " " + parserResults.os.version,
  };

  return data;
}

export default async function Home() {
  const { city, regionName, country, isp, query, mobile, browser, os } = await getData();
  return (
    <>
      <h1>{query}</h1>
      <p>
        {city}, {regionName}, {country}
        <br />
        ISP: {isp}
      </p>
      <p>
        Running <strong>{browser}</strong> on <strong>{os}</strong>
      </p>
      {mobile && (
        <p>
          <em>Mobile device detected. Location data may not be accurate.</em>
        </p>
      )}
    </>
  );
}
