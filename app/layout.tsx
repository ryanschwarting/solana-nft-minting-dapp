import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { NavBar } from "./components/NavBar";
// import { Teko } from "@next/font/google";
// import { Anton } from "@next/font/google";
import { Lilita_One } from "next/font/google";

// const pixel = Teko({
//   subsets: [],
//   weight: ["400", "700"],
// });

// const pixel = Anton({
//   subsets: [],
//   weight: ["400"],
// });

const pixel = Lilita_One({
  subsets: [],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pixel.className}>
      <body className="px-30">
        <AppWalletProvider>
          <div className="py-4">
            <NavBar />
          </div>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
