import React from "react";
import { Inter } from "next/font/google";
import styles from "./page.module.css";
import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://eyep.me"),
  title: "IP Me | IP, Location, and User Agent Lookup",
  authors: [{ name: "PTRFRLL", url: "https://github.com/ptrfrll" }],
  description: "Fast & secure IP, location, and user-agent lookup",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "./favicon.png",
  },
  openGraph: {
    title: "IP Me | IP, Location, and User Agent Lookup",
    description: "IP Me | IP, Location, and User Agent Lookup",
    url: "https://eyep.me/",
    type: "website",
    images: [
      {
        url: "/og.png",
      },
    ],
  },
  twitter: {
    title: "IP Me | IP, Location, and User Agent Lookup",
    description: "Fast & secure IP, location, and user-agent lookup",
    creator: "@ptrfrll",
    images: ["/og.png"],
    site: "https://eyep.me/",
    card: "summary_large_image",
  },
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.contain}>
          <div className={styles.center}>{children}</div>
        </div>
        <footer className={styles.footer}>
          Open source on{" "}
          <a rel="noreferrer" href="https://github.com/PTRFRLL/eyep.me">
            Github
          </a>
        </footer>
      </body>
    </html>
  );
}
