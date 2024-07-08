import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { NavBar } from "./components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppWalletProvider>
          <div className="py-4 px-20">
            <NavBar />
          </div>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
