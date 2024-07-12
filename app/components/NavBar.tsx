"use client";
import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import "@solana/wallet-adapter-react-ui/styles.css";
import { motion } from "framer-motion";
import CustomWalletButton from "./CustomWalletButton";

export const NavBar: React.FC = () => {
  //   const router = useRouter();
  //   const path = usePathname();
  return (
    <nav className="bg-sol-green p-10 h-16 rounded-full shadow-lg shadow-sol-purple">
      <div className="max-w-7xl mx-auto flex  justify-between items-center h-full">
        <div className="text-black font-bold text-[28px]">MONSTER VERSE</div>
        <div className="flex flex-row gap-4">
          <motion.button
            whileHover={{ scale: 0.9 }}
            whileTap={{ scale: 0.8 }}
            className="bg-white font-bold text-[14px] flex items-center justify-center py-2 px-8 rounded-md text-[#7289da]"
          >
            <span className="mr-2 items-center flex justify-center">
              <FaDiscord className="h-[20px] w-[20px] " />
            </span>
            JOIN DISCORD
          </motion.button>
          <WalletMultiButton style={{}} />
          {/* <CustomWalletButton /> */}
        </div>
      </div>
    </nav>
  );
};
