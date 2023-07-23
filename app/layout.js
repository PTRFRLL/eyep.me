export const metadata = {
  metadataBase: new URL("https://eyep.me"),
  title: "IP Me",
  description: "Fast & secure IP, location, and user-agent lookup",
  author: "@PTRFRLL",
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
    card: "summary_large_image",
    title: "IP Me | IP, Location, and User Agent Lookup",
    description: "Fast & secure IP, location, and user-agent lookup",
    creator: "@ptrfrll",
    images: ["/og.png"],
    url: "https://eyep.me/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
