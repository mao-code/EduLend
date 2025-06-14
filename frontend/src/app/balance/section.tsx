"use client";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useAccountStore } from "@/providers/account-store-provider";
import { useShallow } from "zustand/shallow";
import FuncButton from "./button";
import type { FuncButtonType } from "./utils";
import Web3 from "web3";
import {
  lendingPlatformContractABI,
  lendingPlatformContractAddr,
} from "@/lib/web3";
import { usePriceStore } from "@/providers/price-store-provider";

export default function BalanceSection() {
  const { eduBalance } = useAccountStore(
    useShallow((state) => ({
      eduBalance: state.account.eduBalance,
      // mUSDTBalance: state.account.mUSDTBalance,
    })),
  );
  const { prices } = usePriceStore(
    useShallow((state) => ({
      prices: state.prices,
    })),
  );
  const btnList: FuncButtonType[] = ["deposit", "borrow", "repay", "redeem"];

  const liquidate = async () => {
    try {
      if (!window.ethereum) {
        throw new Error(
          "Ethereum provider not found. Please install MetaMask or another Ethereum wallet.",
        );
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3 = new Web3(window.ethereum);

      const instance = new web3.eth.Contract(
        lendingPlatformContractABI,
        lendingPlatformContractAddr.address,
      );
      instance.methods
        .liquidate(accounts[0])
        .send({ from: accounts[0] })
        .then((receipt) => {
          console.log("Liquidation successful:", receipt);
        })
        .catch((error) => {
          console.error("Liquidation failed:", error);
        });
    } catch (error) {
      console.error("Error initializing Web3 or contract instance:", error);
    }
  };

  return (
    <section
      id="balance-section"
      className="flex flex-col grow gap-12 w-full items-center justify-center"
    >
      <div className="flex flex-col items-end gap-2">
        <h1 className="text-4xl font-bold">已存入: {eduBalance || 0} EDU</h1>
        <h1>当前利率: {prices[prices.length - 1]}%</h1>
        {/* <span className="text-zinc-500 font-bold">{mUSDTBalance || 0} mUSDT</span> */}
      </div>
      <div className="flex gap-8">
        {btnList.map((btn) => (
          <FuncButton key={btn} type={btn} />
        ))}
        <div
          id={`liquidate-button`}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Button size="icon" onClick={liquidate}>
            <ChevronRight />
          </Button>
          <p>liquidate</p>
        </div>
      </div>
    </section>
  );
}
