'use client'
import { Button } from "./ui/button";
import { AccountType } from "@/lib/metamask";
import { useState, useCallback } from "react";
import { ethers } from "ethers";

export default function Header() {
    const [accountData, setAccountData] = useState<AccountType | null>(null);

    const _connectToMetaMask= useCallback(async () => {
        const ethereum = window.ethereum;

        if (typeof ethereum !== "undefined") {
            try {
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                }) as string[];

                const address = accounts[0];
                const provider = new ethers.BrowserProvider(ethereum);
                // Get the account balance
                const balance = await provider.getBalance(address);
                // Get the network ID from MetaMask
                const network = await provider.getNetwork();
                // Update state with the results
                setAccountData({
                    address,
                    balance: ethers.formatEther(balance),
                    // The chainId property is a bigint, change to a string
                    chainId: network.chainId.toString(),
                    network: network.name,
                });
                console.log("connected to MetaMask with address: ", address);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: Error | any) {
                alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
            }
            } else {
            alert("MetaMask not installed");
        }
    }, []);

    return (
        <header className="sticky top-0 z-50 py-4 flex items-center justify-around">
          <h1 className="text-2xl font-bold">EduLend</h1>
          <div className="flex items-center gap-2">
            <Button onClick={_connectToMetaMask}>{ !accountData?.address ? 'Connect MetaMask' : 'Connected'}</Button>
            : {accountData?.address}
          </div>
        </header>
    )
}