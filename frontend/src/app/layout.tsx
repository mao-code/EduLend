import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'driver.js/dist/driver.css';

import Header from "@/components/header";
import { AccountStoreProvider } from "@/providers/account-store-provider";
import { PriceStoreProvider } from "@/providers/price-store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduLend",
  description: "Empowering the Next Generation with DeFi Lending Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <PriceStoreProvider>
          <AccountStoreProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </AccountStoreProvider>
        </PriceStoreProvider>
      </body>
    </html>
  );
}
