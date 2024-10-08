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
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen(true)}
              className="text-[16px] md:text-[18px] font-bold bg-white text-black w-[200px] h-[40px] md:h-[50px] rounded-xl"
            >
              {connecting ? "Connecting..." : "Select Wallet"}
            </motion.button>
          </>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 0.95 }}
              whileTap={{ scale: 0.9 }}
              className="flex bg-white text-[16px] md:text-[18px] font-bold text-black w-[200px] h-[40px] md:h-[50px] rounded-xl items-center justify-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedWalletIcon && (
                <Image
                  src={selectedWalletIcon}
                  alt="Wallet Icon"
                  height={20}
                  width={20}
                  className="mr-2 hidden sm:inline"
                />
              )}
              <div className="truncate w-[80px] sm:w-[100px] md:w-[150px]">
                {publicKey.toBase58().slice(0, 4)}..
                {publicKey.toBase58().slice(-4)}
              </div>
            </motion.button>

            <motion.div
              initial={false}
              animate={dropdownOpen ? "open" : "closed"}
              variants={dropdownVariants}
              className="absolute bg-white text-black font-bold text-center text-[12px] sm:text-[14px] md:text-[16px] w-[200px] mt-1 rounded-md z-50 py-2"
            >
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                className="px-2 py-1 sm:px-4 sm:py-2 hover:text-sol-green w-full"
                onClick={handleCopyAddress}
              >
                {copyText}
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                className="px-2 py-1 sm:px-4 sm:py-2 hover:text-sol-green w-full"
                onClick={() => setOpen(true)}
              >
                Change wallet
              </motion.button>
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 0.95 }}
                whileTap={{ scale: 0.9 }}
                className="px-2 py-1 sm:px-4 sm:py-2 hover:text-sol-green w-full"
                onClick={handleDisconnect}
              >
                Disconnect
              </motion.button>
            </motion.div>
          </div>
        )}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-65 px-4 z-50">
            <motion.div
              ref={modalRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={modalVariants}
              className="relative bg-black py-4 px-4 sm:px-6 rounded-xl w-full max-w-[350px] sm:max-w-[450px] border-2 border-sol-purple"
            >
              <div className="flex flex-col gap-3 sm:gap-4">
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setOpen(false)}
                  className="absolute top-2 right-2 text-white text-[24px] sm:text-[30px]"
                >
                  <IoClose />
                </motion.button>

                <motion.h1
                  variants={itemVariants}
                  className="text-center text-[20px] sm:text-[28px] font-bold text-white"
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
                    className="flex bg-sol-purple bg-opacity-50 items-center py-2 sm:py-4 px-3 sm:px-6 text-white w-full border-2 border-white rounded-xl"
                  >
                    <Image
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      height={24}
                      width={24}
                      className="h-6 w-6 sm:h-[30px] sm:w-[30px] mr-3 sm:mr-5"
                    />
                    <div className="flex justify-between w-full items-center">
                      <span className="font-bold text-[14px] sm:text-[18px]">
                        {wallet.adapter.name}
                      </span>
                      <span className="font-bold text-[14px] sm:text-[18px] flex items-center">
                        Detected{" "}
                        <span className="text-[14px] sm:text-[22px] ml-1 sm:ml-2">
                          <IoMdArrowDropright />
                        </span>
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
