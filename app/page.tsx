import React from "react";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

type LookupData = {
  city: string;
  regionName: string;
  isp: string;
  proxy: boolean;
  mobile: boolean;
  query: string;
  country: string;
  os: string;
  browser: string;
};

async function getData() {
  const head = headers();
  const ip = head.get("x-real-ip") ?? head.get("x-forwarded-for");
  const userAgent = head.get("user-agent") ?? "";
  const res = await fetch(`http://ip-api.com/json/${ip}?fields=query,country,regionName,city,isp,mobile,status,proxy`);

  if (!res.ok) {
    throw new Error("Error in fetch");
  }

  let parser = new UAParser(userAgent);
  let parserResults = parser.getResult();

  const { city, regionName, country, isp, query, mobile, proxy } = await res.json();
  const os = parserResults ? parserResults?.os?.name + " " + parserResults?.os?.version : "Unknown";
  const browser = parserResults?.browser?.name ?? "Unknown browser";

  const data: LookupData = {
    city,
    regionName,
    country,
    isp,
    query,
    mobile,
    proxy,
    browser,
    os,
  };

  return data;
}

export default async function Home() {
  const { city, regionName, country, isp, query, mobile, browser, os, proxy } = await getData();
  return (
    <>
      <h1>{query}</h1>
      <p>
        {city}, {regionName}, {country}
        <br />
        ISP: {isp} {proxy && <span>(VPN detected)</span>}
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
