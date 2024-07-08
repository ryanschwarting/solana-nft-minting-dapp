import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { NavBar } from "./components/NavBar";
import { LandingPage } from "./components/LandingPage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          {" "}
          <div className="py-4 px-24">
            <NavBar />
          </div>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
