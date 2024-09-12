"use client";
import React, { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import "@solana/wallet-adapter-react-ui/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { CustomWalletButton } from "./CustomWalletButton";

const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-sol-green p-4 md:p-4 rounded-full shadow-lg shadow-sol-purple fixed top-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-black font-bold text-[24px] lg:text-[28px]">
          MONSTER VERSE
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center space-x-4">
          <NavButton
            href="https://discord.com"
            icon={<FaDiscord className="w-6 h-6" />}
            text="Join Discord"
          />
          <CustomWalletButton />
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-black"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <HiX className="w-6 h-6" />
          ) : (
            <HiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden absolute left-0 right-0 top-full mt-2 bg-sol-green p-4 rounded-b-2xl shadow-lg z-50"
          >
            <div className="flex flex-col space-y-4 justify-center items-center">
              <NavButton
                href="https://discord.com"
                icon={<FaDiscord className="w-6 h-6" />}
                text="Join Discord"
              />
              <CustomWalletButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavButton: React.FC<{
  href: string;
  icon: React.ReactNode;
  text: string;
}> = ({ href, icon, text }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 0.95 }}
    whileTap={{ scale: 0.9 }}
    className="bg-white font-bold text-[16px] flex items-center justify-center w-[200px] h-[40px] md:h-[50px] rounded-xl text-black"
  >
    <span className="mr-2 flex items-center">{icon}</span>
    {text}
  </motion.a>
);
