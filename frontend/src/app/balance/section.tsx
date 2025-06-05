'use client'
import { useAccountStore } from "@/providers/account-store-provider"
import { useShallow } from "zustand/shallow";
import FuncButton from './button';
import type { FuncButtonType } from "./utils";

export default function BalanceSection() {
    const { balance } = useAccountStore(useShallow((state) => ({
        balance: state.account.balance,
    })));
    const btnList: FuncButtonType[] = ["deposit", "borrow", "repay", "redeem"];

    return (
        <section id="balance-section" className="flex flex-col grow gap-12 w-full items-center justify-center">
            <h1 className="text-4xl font-bold">Balance: {balance}</h1>
            <div className="flex gap-8">
                {btnList.map((btn) => (
                    <FuncButton key={btn} type={btn} />
                ))}
            </div>
        </section>
    );
}