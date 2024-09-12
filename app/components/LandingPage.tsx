"use client";
import { useState, useEffect } from "react";
import {
  guestIdentity,
  Metaplex,
  walletAdapterIdentity,
  CandyMachine,
  DefaultCandyGuardSettings,
} from "@metaplex-foundation/js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { IoClose } from "react-icons/io5";
import { TiPlus, TiMinus } from "react-icons/ti";
import Image from "next/image";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const CANDY_MACHINE_ID = new PublicKey(
  "HyhmxVFbZNA9DLjr4xBqHZjWXAPzr1j8Mrot4vV7FLAP"
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const LandingPage = () => {
  const [metaplex, setMetaplex] = useState<Metaplex | undefined>(undefined);
  const [candyState, setCandyState] = useState<
    CandyMachine<DefaultCandyGuardSettings> | undefined
  >(undefined);
  const [candyStateError, setCandyStateError] = useState<string | undefined>(
    undefined
  );
  const [candyStateLoading, setCandyStateLoading] = useState<boolean>(true);
  const [txError, setTxError] = useState<string | null>(null);
  const [txLoading, setTxLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<any[]>([]);
  const [mintResult, setMintResult] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [mintLimit, setMintLimit] = useState<number>(1);

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  useEffect(() => {
    setMetaplex(
      Metaplex.make(connection).use(
        wallet ? walletAdapterIdentity(wallet) : guestIdentity()
      )
    );
  }, [connection, wallet]);

  useEffect(() => {
    if (!metaplex) return;

    const updateState = async () => {
      try {
        const state = await metaplex
          .candyMachines()
          .findByAddress({ address: CANDY_MACHINE_ID });
        setCandyState(state);
        setNfts(state.items);

        // Check if mintLimit exists before setting it
        if (state?.candyGuard?.guards?.mintLimit?.limit) {
          setMintLimit(state.candyGuard.guards.mintLimit.limit);
        }

        setCandyStateError(undefined);
      } catch (e: any) {
        console.log(e);
        // toast.error("Error has occurred!");
        setCandyStateError(e.message);
      } finally {
        setCandyStateLoading(false);
      }
    };
    updateState();

    // Refresh state every 15 seconds
    const intervalId = setInterval(() => updateState(), 15_000);
    return () => clearInterval(intervalId);
  }, [metaplex]);

  const mint = async (quantity: number) => {
    if (!metaplex || !candyState) {
      setTxError("Metaplex or Candy Machine state is not defined");
      return;
    }

    setTxLoading(true);
    setTxError(null);

    try {
      const { address, collectionMintAddress, candyGuard, authorityAddress } =
        candyState;

      if (
        !address ||
        !collectionMintAddress ||
        !candyGuard ||
        !authorityAddress
      ) {
        setTxError("Candy Machine state is missing required properties");
        setTxLoading(false);
        return;
      }

      const mintResults = [];
      for (let i = 0; i < quantity; i++) {
        const mintResult = await metaplex.candyMachines().mint({
          candyMachine: {
            address: address,
            collectionMintAddress: collectionMintAddress,
            candyGuard: candyGuard,
          },
          collectionUpdateAuthority: authorityAddress,
          group: null,
        });
        mintResults.push(mintResult);
      }

      const mintData = mintResults.map((result) => ({
        transactionId: result.response.signature,
        nftId: result.nft.address.toString(),
        nftName: result.nft.json?.name,
        nftImage: result.nft.json?.image,
      }));

      console.log("Mint successful:", mintData);
      setMintResult(mintData);
      setShowModal(true);
      //   toast.success("Mint successful!", { autoClose: 1500 });
    } catch (e: any) {
      console.log(e);
      //   toast.error("Mint failed!");
      setTxError(e.message);
    } finally {
      setTxLoading(false);
    }
  };

  const soldOut = candyState?.itemsRemaining.eqn(0);

  const solAmount = candyState?.candyGuard?.guards?.solPayment
    ? Number((candyState.candyGuard.guards.solPayment as any).lamports) /
      LAMPORTS_PER_SOL
    : null;

  return (
    <div className="relative flex flex-row justify-between gap-20 overflow-hidden pt-10">
      {/* <ToastContainer /> */}
      {candyStateLoading ? (
        <div> Loading ...</div>
      ) : candyStateError ? (
        <div>{candyStateError}</div>
      ) : (
        candyState && (
          <div className="">
            <p className="font-bold text-[32px] text-sol-green">
              {candyState.itemsMinted.toString()} /{" "}
              {candyState.itemsAvailable.toString()} Minted
            </p>
            <h1 className="font-bold text-[42px]">MONSTER VERSE</h1>
            <h1 className="font-bold text-[42px] leading-10">
              DIGITAL COLLECTIBLES
            </h1>
            <p className="font-bold text-[20px] mt-6">
              7,777 Unique Digital Collectibles
            </p>
            <p className="font-bold text-[20px]">
              Living on the Solana Blockchain
            </p>
            <p className="font-bold text-[20px] mt-6">
              Mint Date: December 25th, 2024
            </p>
            {solAmount && (
              <p className="font-bold text-[20px] text-sol-purple py-6">
                Mint Price: {solAmount} SOL
              </p>
            )}
            {txError && <p>{txError}</p>}
            <div className="font-bold text-[16px] ">
              Limit Per Wallet: {mintLimit}
            </div>
            <div className="flex items-center gap-4 py-4 font-bold">
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <TiMinus size={24} />
              </motion.button>
              <span className="text-[16px]">{quantity}</span>
              <motion.button
                whileHover={{ scale: 0.9 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setQuantity(Math.min(mintLimit, quantity + 1))}
                disabled={quantity >= mintLimit}
              >
                <TiPlus size={24} />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 0.9 }}
              whileTap={{ scale: 0.8 }}
              className="bg-sol-green text-black text-[24px] py-4 px-20 rounded-xl font-bold shadow-2xl shadow-sol-purple hover:shadow-none"
              onClick={() => mint(quantity)}
              disabled={!wallet || txLoading || soldOut}
            >
              {soldOut ? "Sold Out" : txLoading ? "Loading..." : "Mint"}
            </motion.button>
          </div>
        )
      )}

      {showModal && mintResult && (
        <>
          <div className="fixed inset-0 z-50 overflow-hidden">
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </div>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="relative flex flex-col items-center bg-black p-6 rounded-2xl shadow-2xl shadow-sol-purple w-[800px] max-h-[80vh] overflow-y-auto">
              <motion.div
                className="flex flex-col items-center justify-center gap-2 w-full"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.button
                  whileHover={{ scale: 0.9 }}
                  whileTap={{ scale: 0.8 }}
                  className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  <IoClose className="w-[30px] h-[30px] text-white" />
                </motion.button>
                <motion.h2
                  className="text-[24px] font-bold mb-4 text-white text-center"
                  variants={textVariants}
                >
                  MINT SUCCESSFUL!
                </motion.h2>
                <div className="w-full flex flex-col items-center">
                  {mintResult.map((result: any, index: number) => (
                    <div
                      key={index}
                      className="mb-10 text-center rounded-xl p-4 border border-sol-purple shadow-lg shadow-sol-purple"
                    >
                      <motion.p
                        className="text-white text-[16px] font-bold"
                        variants={textVariants}
                      >
                        COLLECTIBLE NAME:
                      </motion.p>
                      <motion.p
                        className="text-white text-[14px] font-light uppercase mb-2"
                        variants={textVariants}
                      >
                        {result.nftName}
                      </motion.p>
                      <motion.p
                        className="text-white text-[16px] font-bold"
                        variants={textVariants}
                      >
                        COLLECTIBLE ID:
                      </motion.p>
                      <motion.p
                        className="text-white text-[14px] font-light mb-2"
                        variants={textVariants}
                      >
                        {result.nftId}
                      </motion.p>
                      <motion.p
                        className="text-white text-[16px] font-bold"
                        variants={textVariants}
                      >
                        TRANSACTION ID:
                      </motion.p>
                      <motion.a
                        whileHover={{ scale: 0.9 }}
                        whileTap={{ scale: 0.8 }}
                        href={`https://solscan.io/tx/${result.transactionId}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sol-purple underline text-[12px] font-light"
                        variants={textVariants}
                      >
                        {result.transactionId}
                      </motion.a>

                      {result.nftImage && (
                        <motion.img
                          src={result.nftImage}
                          alt="Minted NFT"
                          className="w-full h-auto max-w-xs rounded-xl mx-auto mt-4"
                          variants={textVariants}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}

      <div className="text-center">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 row-span-2 flex flex-col justify-between pt-10">
            <Image
              src="/1.png"
              alt="Image 1"
              width={150}
              height={150}
              className="w-full h-auto mb-4 shadow-2xl shadow-sol-purple rounded-xl"
            />
            <Image
              src="/2.png"
              alt="Image 2"
              width={150}
              height={150}
              className="w-full h-auto shadow-2xl shadow-sol-purple rounded-xl"
            />
          </div>
          <div className="col-span-1 row-span-3 flex flex-col justify-between">
            <Image
              src="/3.png"
              alt="Image 3"
              width={150}
              height={150}
              className="w-full h-auto mb-4 shadow-2xl shadow-sol-purple rounded-xl"
            />
            <Image
              src="/4.png"
              alt="Image 4"
              width={150}
              height={150}
              className="w-full h-auto mb-4 shadow-2xl shadow-sol-purple rounded-xl"
            />
            <Image
              src="/5.png"
              alt="Image 5"
              width={150}
              height={150}
              className="w-full h-auto shadow-2xl shadow-sol-purple rounded-xl"
            />
          </div>
          <div className="col-span-1 row-span-2 flex flex-col justify-between pt-10">
            <Image
              src="/6.png"
              alt="Image 6"
              width={150}
              height={150}
              className="w-full h-auto mb-4  shadow-2xl shadow-sol-purple rounded-xl"
            />
            <Image
              src="/7.png"
              alt="Image 7"
              width={150}
              height={150}
              className="w-full h-auto shadow-2xl shadow-sol-purple rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
