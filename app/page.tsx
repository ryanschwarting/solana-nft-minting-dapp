"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LandingPage } from "./components/LandingPage";

export default function Home() {
  return (
    <main className="flex justify-center w-full min-h-screen">
      <LandingPage />
    </main>
  );
}
