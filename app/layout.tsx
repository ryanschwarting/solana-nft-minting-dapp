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

export const metadata: Metadata = {
  title: "Monster Verse Mint",
  description:
    "7,777 Unique Digital Collectibles Living on the Solana Blockchain",
  openGraph: {
    title: "Monster Verse Mint",
    description:
      "7,777 Unique Digital Collectibles Living on the Solana Blockchain",
    url: "https://solana-nft-minting-dapp-kaktos.vercel.app/",
    siteName: "Monster Verse Mint",
    images: [
      {
        url: "/kaktosSMB.png",
        width: 1260,
        height: 800,
      },
    ],
  },
  twitter: {
    site: `@KaktosSol`,
    creator: `@KaktosSol`,
    card: "summary",
  },
  category: "blockchain",
  icons: "/kaktosSMB.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pixel.className}>
      <body className="px-28">
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
