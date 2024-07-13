"use client";
import React, { useEffect, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import { WalletName } from "@solana/wallet-adapter-base";
import { motion, Variants } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdArrowDropright } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const dropdownVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

const modalVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  closed: {
    clipPath: "inset(10% 50% 90% 50% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

// Handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

export const CustomWalletButton = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedWalletIcon, setSelectedWalletIcon] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);
  const [copyText, setCopyText] = useState("Copy address");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!connection || !publicKey) return;

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  useEffect(() => {
    const savedIcon = localStorage.getItem("selectedWalletIcon");
    if (savedIcon) {
      setSelectedWalletIcon(savedIcon);
    }
  }, []);

  useEffect(() => {
    if (selectedWalletIcon) {
      localStorage.setItem("selectedWalletIcon", selectedWalletIcon);
    }
  }, [selectedWalletIcon]);

  const handleWalletSelect = async (walletName: WalletName) => {
    try {
      const selectedWallet = wallets.find(
        (wallet) => wallet.adapter.name === walletName
      );
      if (selectedWallet) {
        setSelectedWalletIcon(selectedWallet.adapter.icon);
      }
      select(walletName);
      setOpen(false);
      setDropdownOpen(false); // Close the dropdown when a wallet is selected
    } catch (error) {
      console.log("wallet connection error:", error);
    }
  };

  const handleDisconnect = async () => {
    disconnect();
    setSelectedWalletIcon("");
    localStorage.removeItem("selectedWalletIcon");
  };

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setCopyText("Copied");
      setTimeout(() => {
        setCopyText("Copy address");
      }, 1000);
    }
  };

  return (
    <div className="text-white z-50 ">
      <div className="flex gap-2 items-center">
        {!publicKey ? (
          <>
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setOpen(true)}
              className="text-[12px] md:text-[18px] font-bold bg-white text-black h-[40px] md:h-[60px] w-[200px] rounded-xl"
            >
              {connecting ? "Connecting..." : "Select Wallet"}
            </motion.button>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              className="flex bg-white text-[12px] md:text-[18px] font-bold text-black h-[40px] md:h-[60px] w-[200px] rounded-xl items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedWalletIcon && (
                <Image
                  src={selectedWalletIcon}
                  alt="Wallet Icon"
                  height={30}
                  width={30}
                  className="ml-4"
                />
              )}
              <div className="truncate md:w-[150px] w-[100px]">
                {publicKey.toBase58().slice(0, 4)}..
                {publicKey.toBase58().slice(-4)}
              </div>
              {/* <div>
                {balance !== null ? (
                  <div>{toFixed(balance, 2)} SOL</div>
                ) : (
                  <div>0 SOL</div>
                )}
              </div> */}
            </motion.button>
            <ToastContainer />

            <motion.div
              initial={false}
              animate={dropdownOpen ? "open" : "closed"}
              variants={dropdownVariants}
              className="absolute bg-white text-black font-bold text-center text-[16px] w-[200px] mt-1 rounded-md z-50 py-2"
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-2 hover:text-sol-green"
                onClick={handleCopyAddress}
              >
                {copyText}
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-2 hover:text-sol-green"
                onClick={() => setOpen(true)}
              >
                Change wallet
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                className="px-4 py-2 hover:text-sol-green"
                onClick={handleDisconnect}
              >
                Disconnect
              </motion.button>
            </motion.div>
          </div>
        )}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 ">
            <motion.div
              ref={modalRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={modalVariants}
              className="relative bg-black py-4 px-10 rounded-xl max-w-[450px] w-full border-2 border-sol-purple"
            >
              <div className="flex flex-col gap-4">
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setOpen(false)}
                  className="absolute top-4 right-4 text-white text-[30px]"
                >
                  <IoClose />
                </motion.button>

                <motion.h1
                  variants={itemVariants}
                  className="text-center text-[28px] font-bold text-white"
                >
                  Connect Wallet
                </motion.h1>
                {wallets.map((wallet) => (
                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.85 }}
                    key={wallet.adapter.name}
                    onClick={() => handleWalletSelect(wallet.adapter.name)}
                    className="flex bg-sol-purple bg-opacity-50 items-center py-4 px-6 text-white w-full border-2 border-white rounded-xl"
                  >
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={40}
                      width={40}
                      className="mr-5"
                    />
                    <div className="flex justify-between w-full items-center">
                      <span className="font-bold text-[16px]">
                        {wallet.adapter.name}
                      </span>
                      <span className="font-bold text-[16px] flex items-center">
                        Detected{" "}
                        <span className="text-[22px] ml-2">
                          <IoMdArrowDropright />
                        </span>
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              {/* <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setOpen(false)}
                className="mt-4 text-white underline"
              >
                Close
              </motion.button> */}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
