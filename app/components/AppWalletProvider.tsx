"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export default function AppWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const networkMain = WalletAdapterNetwork.Mainnet;
  // const networkMain = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
  const networkDev = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(networkDev), [networkDev]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // new LedgerWalletAdapter(),
      //   new UnsafeBurnerWalletAdapter(),
    ],
    [networkDev]
  );

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "confirmed" }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
