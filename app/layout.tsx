"use client";

import "./globals.css";
import { ReactNode } from "react";

const fontFamily = `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily,
          backgroundColor: "#030712",
          color: "#f9fafb"
        }}
      >
        {children}
      </body>
    </html>
  );
}
