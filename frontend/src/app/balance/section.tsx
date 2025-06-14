"use client";
import { useAccountStore } from "@/providers/account-store-provider";
import { useShallow } from "zustand/shallow";
import FuncButton from "./button";
import type { FuncButtonType } from "./utils";
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

  return (
    <section
      id="balance-section"
      className="flex flex-col grow gap-12 w-full items-center justify-center"
    >
      <div className="flex flex-col items-end gap-2">
        <h1 className="text-4xl font-bold">已存入: {eduBalance || 0} EDU</h1>
        <h1 className="text-zinc-500">當前利率: {prices[prices.length - 1]}%</h1>
        {/* <span className="text-zinc-500 font-bold">{mUSDTBalance || 0} mUSDT</span> */}
      </div>
      <div className="flex gap-8">
        {btnList.map((btn) => (
          <FuncButton key={btn} type={btn} />
        ))}
      </div>
    </section>
  );
}
