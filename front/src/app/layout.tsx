import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paladium - Labelling System",
  description: "Admin panel for managing image labelling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.prod.website-files.com/68002f479f875a9bbeebdc8e/68a37451a60a264f468a499a_pax-32.png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="https://cdn.prod.website-files.com/68002f479f875a9bbeebdc8e/68a374548ca5118e0c50804f_pax-256.png"
          rel="apple-touch-icon"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
