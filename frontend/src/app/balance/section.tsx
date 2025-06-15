"use client";
import { useAccountStore } from "@/providers/account-store-provider";
import { useShallow } from "zustand/shallow";
import FuncButton from "./button";
import type { FuncButtonType } from "./utils";
import { usePriceStore } from "@/providers/price-store-provider";

export default function BalanceSection() {
  const { collateral, principal } = useAccountStore(
    useShallow((state) => ({
      collateral: state.account.collateral,
      principal: state.account.principal,
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
      className="flex flex-col grow gap-12 my-12 w-full items-center justify-center"
    >
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-4xl font-bold">已存入: {collateral || 0} EDU</h1>
        <span className="text-4xl font-bold">已借出: {principal || 0} mUSDT</span>
        <h1 className="text-zinc-500">當前利率: {prices[prices.length - 1]}%</h1>
      </div>
      <div className="flex gap-8">
        {btnList.map((btn) => (
          <FuncButton key={btn} type={btn} />
        ))}
      </div>
    </section>
  );
}
