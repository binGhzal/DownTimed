import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Downtimed",
  description: "A web-first downtime organizer for movies, shows, books, games, and manual items.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
