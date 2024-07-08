// "use client";
// import { useState, useEffect } from "react";
// import {
//   guestIdentity,
//   Metaplex,
//   walletAdapterIdentity,
//   CandyMachine,
//   DefaultCandyGuardSettings,
// } from "@metaplex-foundation/js";

// import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { toast } from "react-toastify";

// // const CANDY_MACHINE_ID = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID
// //   ? new PublicKey(process.env.NEXT_PUBLIC_CANDY_MACHINE_ID).toString()
// //   : null;

// const CANDY_MACHINE_ID = new PublicKey(
//   "EUjKVfRz1PZLS4PkiGy296tTHgxPR8RkkqYEBSzu55U1"
// );

// export const LandingPage = () => {
//   const [metaplex, setMetaplex] = useState<Metaplex | undefined>(undefined);
//   const [candyState, setCandyState] = useState<
//     CandyMachine<DefaultCandyGuardSettings> | undefined
//   >(undefined);
//   const [candyStateError, setCandyStateError] = useState<string | undefined>(
//     undefined
//   );
//   const [candyStateLoading, setCandyStateLoading] = useState<boolean>(true);
//   const [txError, setTxError] = useState<string | null>(null);
//   const [txLoading, setTxLoading] = useState<boolean>(false);
//   const [nfts, setNfts] = useState<any[]>([]);

//   const { connection } = useConnection();
//   const wallet = useAnchorWallet();

//   useEffect(() => {
//     setMetaplex(
//       Metaplex.make(connection).use(
//         wallet ? walletAdapterIdentity(wallet) : guestIdentity()
//       )
//     );
//   }, [connection, wallet]);

//   useEffect(() => {
//     if (!metaplex) return;

//     const updateState = async () => {
//       try {
//         const state = await metaplex
//           .candyMachines()
//           .findByAddress({ address: CANDY_MACHINE_ID });
//         setCandyState(state);
//         setNfts(state.items);
//         setCandyStateError(undefined);
//       } catch (e: any) {
//         console.log(e);
//         toast.error("Error has occurred!");
//         setCandyStateError(e.message);
//       } finally {
//         setCandyStateLoading(false);
//       }
//     };
//     updateState();

//     //refresh state every 30 seconds
//     const intervalId = setInterval(() => updateState(), 15_000);
//     return () => clearInterval(intervalId);
//   }, [metaplex]);

//   const mint = async () => {
//     if (!metaplex || !candyState) {
//       setTxError("Metaplex or Candy Machine state is not defined");
//       return;
//     }

//     setTxLoading(true);
//     setTxError(null);

//     try {
//       const { address, collectionMintAddress, candyGuard, authorityAddress } =
//         candyState;

//       if (
//         !address ||
//         !collectionMintAddress ||
//         !candyGuard ||
//         !authorityAddress
//       ) {
//         setTxError("Candy Machine state is missing required properties");
//         setTxLoading(false);
//         return;
//       }

//       const mintResult = await metaplex.candyMachines().mint({
//         candyMachine: {
//           address: address,
//           collectionMintAddress: collectionMintAddress,
//           candyGuard: candyGuard,
//         },
//         collectionUpdateAuthority: authorityAddress,
//         group: null,
//       });

//       // Handle the mint result as needed
//       console.log("Mint successful:", mintResult);
//       toast.success("Mint successful!");
//     } catch (e: any) {
//       console.log(e);
//       toast.error("Mint failed!");
//       setTxError(e.message);
//     } finally {
//       setTxLoading(false);
//       toast.success("Minted NFT! Congratulations!");
//     }
//   };

//   const soldOut = candyState?.itemsRemaining.eqn(0);

//   const solAmount = candyState?.candyGuard?.guards?.solPayment
//     ? Number((candyState.candyGuard.guards.solPayment as any).lamports) /
//       LAMPORTS_PER_SOL
//     : null;

//   return (
//     <div>
//       {candyStateLoading ? (
//         <div> Loading ...</div>
//       ) : candyStateError ? (
//         <div>{candyStateError}</div>
//       ) : (
//         candyState && (
//           <div>
//             <p>Total Supply: {candyState.itemsAvailable.toString()}</p>
//             <p>Amount Minted: {candyState.itemsMinted.toString()}</p>
//             <p>Remaining Supply: {candyState.itemsRemaining.toString()}</p>
//             {solAmount && <p>Mint Price: {solAmount} Sol</p>}
//             {txError && <p>{txError}</p>}
//             <button
//               className="bg-sol-green text-black p-2 px-6 rounded-lg"
//               onClick={mint}
//               disabled={!wallet || txLoading || soldOut}
//             >
//               {soldOut ? "SOLD OUT" : txLoading ? "LOADING" : "Mint"}
//             </button>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

const CANDY_MACHINE_ID = new PublicKey(
  "EUjKVfRz1PZLS4PkiGy296tTHgxPR8RkkqYEBSzu55U1"
);

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
        setCandyStateError(undefined);
      } catch (e: any) {
        console.log(e);
        toast.error("Error has occurred!");
        setCandyStateError(e.message);
      } finally {
        setCandyStateLoading(false);
      }
    };
    updateState();

    // Refresh state every 30 seconds
    const intervalId = setInterval(() => updateState(), 30_000);
    return () => clearInterval(intervalId);
  }, [metaplex]);

  const mint = async () => {
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

      const mintResult = await metaplex.candyMachines().mint({
        candyMachine: {
          address: address,
          collectionMintAddress: collectionMintAddress,
          candyGuard: candyGuard,
        },
        collectionUpdateAuthority: authorityAddress,
        group: null,
      });

      // Extract necessary data from mintResult
      const mintData = {
        transactionId: mintResult.response.signature,
        nftId: mintResult.nft.address.toString(),
        nftName: mintResult.nft.json?.name,
        nftImage: mintResult.nft.json?.image,
      };

      // Handle the mint result
      console.log("Mint successful:", mintData);
      setMintResult(mintData);
      setShowModal(true);
      toast.success("Mint successful!");
    } catch (e: any) {
      console.log(e);
      toast.error("Mint failed!");
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
    <div className="relative flex flex-row justify-center gap-20">
      <ToastContainer />
      {candyStateLoading ? (
        <div> Loading ...</div>
      ) : candyStateError ? (
        <div>{candyStateError}</div>
      ) : (
        candyState && (
          <div className="pt-10 pr-20">
            <p className="font-bold text-[32px] text-sol-green">
              {candyState.itemsMinted.toString()} /{" "}
              {candyState.itemsAvailable.toString()} MINTED
            </p>
            <h1 className="font-bold text-[48px]">MONSTER VERSE</h1>
            <h1 className="font-bold text-[48px] leading-10">
              NFT COLLECTION{" "}
            </h1>
            {solAmount && (
              <p className="font-bold text-[22px] text-sol-purple py-4 pt-10">
                MINT PRICE: {solAmount} SOL
              </p>
            )}
            {txError && <p>{txError}</p>}
            <button
              className="bg-sol-green text-black text-[24px] py-4 px-20 rounded-lg font-bold"
              onClick={mint}
              disabled={!wallet || txLoading || soldOut}
            >
              {soldOut ? "SOLD OUT" : txLoading ? "LOADING" : "MINT"}
            </button>
          </div>
        )
      )}
      {showModal && mintResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="relative justify-center bg-white p-6 rounded-lg shadow-lg w-[800px]">
            <div className="flex flex-col justify-center items-center gap-2">
              <button
                className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <IoClose className="w-[30px] h-[30px]" />
              </button>
              <h2 className="text-[24px] font-bold mb-4 text-black">
                MINT SUCCESSFUL!{" "}
              </h2>
              <p className="text-black text-[14px] font-bold">
                TRANSACTION ID:
              </p>
              <a
                href={`https://solscan.io/tx/${mintResult.transactionId}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sol-green underline text-[12px] font-light "
              >
                {mintResult.transactionId}
              </a>
              <p className="text-black text-[14px] font-bold">NFT ID:</p>
              <p className="text-black text-[12px] font-light">
                {mintResult.nftId}
              </p>
              <p className="text-black text-[14px] font-bold">NFT NAME:</p>
              <p className="text-black text-[12px] font-light">
                {mintResult.nftName}
              </p>
              {mintResult.nftImage && (
                <img
                  src={mintResult.nftImage}
                  alt="Minted NFT"
                  className="w-full h-auto max-w-xs border-4 border-black"
                />
              )}
            </div>
          </div>
        </div>
      )}
      <div className="text-center pr-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 row-span-2 flex flex-col justify-between pt-10">
            <Image
              src="/1.png"
              alt="Image 1"
              width={150}
              height={150}
              className="w-full h-auto mb-4 shadow-2xl shadow-sol-green rounded-md"
            />
            <Image
              src="/2.png"
              alt="Image 2"
              width={150}
              height={150}
              className="w-full h-auto shadow-2xl shadow-sol-green rounded-md"
            />
          </div>
          <div className="col-span-1 row-span-3 flex flex-col justify-between">
            <Image
              src="/3.png"
              alt="Image 3"
              width={150}
              height={150}
              className="w-full h-auto mb-4 shadow-2xl shadow-sol-green rounded-md"
            />
            <Image
              src="/4.png"
              alt="Image 4"
              width={150}
              height={150}
              className="w-full h-auto mb-4 shadow-2xl shadow-sol-green rounded-md"
            />
            <Image
              src="/5.png"
              alt="Image 5"
              width={150}
              height={150}
              className="w-full h-auto shadow-2xl shadow-sol-green rounded-md"
            />
          </div>
          <div className="col-span-1 row-span-2 flex flex-col justify-between pt-10">
            <Image
              src="/6.png"
              alt="Image 6"
              width={150}
              height={150}
              className="w-full h-auto mb-4  shadow-2xl shadow-sol-green rounded-md"
            />
            <Image
              src="/7.png"
              alt="Image 7"
              width={150}
              height={150}
              className="w-full h-auto shadow-2xl shadow-sol-green rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
