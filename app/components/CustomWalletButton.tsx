"use client";
import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import { WalletName } from "@solana/wallet-adapter-base";

// Handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

const CustomWalletButton = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  //   const [balance, setBalance] = useState<number | null>(null);

  //   useEffect(() => {
  //     if (!connection || !publicKey) return;

  //     connection.onAccountChange(
  //       publicKey,
  //       (updatedAccountInfo) => {
  //         setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
  //       },
  //       "confirmed"
  //     );

  //     connection.getAccountInfo(publicKey).then((info) => {
  //       if (info) {
  //         setBalance(info.lamports / LAMPORTS_PER_SOL);
  //       }
  //     });
  //   }, [publicKey, connection]);

  const handleWalletSelect = async (walletName: WalletName) => {
    try {
      select(walletName);
      setOpen(false);
    } catch (error) {
      console.log("wallet connection error:", error);
    }
  };

  const handleDisconnect = async () => {
    disconnect();
  };

  return (
    <div className="text-white z-50">
      <div className="flex gap-2 items-center">
        {!publicKey ? (
          <>
            <button
              onClick={() => setOpen(true)}
              className="text-[12px] md:text-[14px] bg-sol-purple p-2 text-black ring-black ring-2 h-[40px] md:h-[60px] border-2 border-white font-slackey xrounded-xl"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          </>
        ) : (
          <div className="relative">
            <button className="flex gap-2 bg-sol-purple text-[20px] md:text-[12px] text-white ring-black ring-2 h-[40px] md:h-[60px] border-2 border-white font-slackey z-50">
              <div className="truncate md:w-[150px] w-[100px]">
                {publicKey.toBase58()}
              </div>
              {/* {balance !== null ? (
                <div>{toFixed(balance, 2)} SOL</div>
              ) : (
                <div>0 SOL</div>
              )} */}
            </button>
            <div className="absolute bg-black w-[300px] mt-2 rounded-md shadow-lg">
              <button
                className="bg-[#ff5555] z-50 text-[20px] text-white border-2 border-white font-slackey w-full py-2"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-black p-4 rounded-md max-w-[450px] w-full">
              <div className="flex flex-col space-y-5">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.adapter.name}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    className="flex items-center justify-between h-[40px] bg-transparent text-white text-[20px] font-slackey w-full"
                  >
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={50}
                      width={50}
                      className="mr-5"
                    />
                    <span>{wallet.adapter.name}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 text-white underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomWalletButton;
