'use client'
import { Button } from "./ui/button";
import { useCallback } from "react";
import Link from "next/link"
import { useAccountStore } from "@/providers/account-store-provider";
import { useShallow } from "zustand/shallow";
import Web3 from "web3";
import { lendingPlatformContractABI, lendingPlatformContractAddr } from "@/lib/web3";

export default function Header() {
    const { accountData, setAccountData } = useAccountStore(useShallow((state) => ({
        accountData: state.account,
        setAccountData: state.setAccount,
    })));

    const _connectToMetaMask= useCallback(async () => {
        const ethereum = window.ethereum;

        if (typeof ethereum !== "undefined") {
            try {
                const web3 = new Web3(ethereum);
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                }) as string[];

                const lendingPlatformContract = new web3.eth.Contract(lendingPlatformContractABI, lendingPlatformContractAddr.address);
                // const eduTokenContract = new web3.eth.Contract(eduTokenContractABI, "0x5FbDB2315678afecb367f032d93F642f64180aa3");

                console.log("lendingPlatformContract Addr: ", lendingPlatformContractAddr.address);

                const address = accounts[0];
                
                // Update state with the results
                setAccountData({
                    address,
                    eduBalance: web3.utils.fromWei(await lendingPlatformContract.methods.collateral(accounts[0]).call(), "ether"), // Convert balance from wei to ether
                    // mUSDTBalance: web3.utils.fromWei(await eduTokenContract.methods.currentPriceInMusdt(accounts[0]).call(), "ether"), // Placeholder, update with actual logic if needed
                });
                console.log("connected to MetaMask with address: ", address);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: Error | any) {
                alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
            }
        } else {
            alert("MetaMask not installed");
        }
    }, [setAccountData]);

    return (
        <header className="sticky top-0 z-50 py-4 px-6 flex items-center justify-between bg-slate-200">
          <Link href="/">
            <h1 className="text-2xl font-bold">EduLend</h1>
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={_connectToMetaMask}>{ !accountData?.address ? 'Connect MetaMask' : 'Connected'}</Button>
            : {accountData?.address}
          </div>
        </header>
    )
}