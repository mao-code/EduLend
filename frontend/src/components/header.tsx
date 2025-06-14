"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { useCallback } from "react";
import Link from "next/link";
import { useAccountStore } from "@/providers/account-store-provider";
import { useShallow } from "zustand/shallow";
import Web3 from "web3";
import {
  lendingPlatformContractABI,
  lendingPlatformContractAddr,
  priceOracleContractABI,
  priceOracleContractAddr,
} from "@/lib/web3";
import { usePriceStore } from "@/providers/price-store-provider";

export default function Header() {
  const { accountData, setAccountData } = useAccountStore(
    useShallow((state) => ({
      accountData: state.account,
      setAccountData: state.setAccount,
    })),
  );
  const { setPrice } = usePriceStore(
    useShallow((state) => ({
      setPrice: state.setPrice,
    })),
  );

  const _connectToMetaMask = useCallback(async () => {
    const ethereum = window.ethereum;

    if (typeof ethereum !== "undefined") {
      try {
        const web3 = new Web3(ethereum);
        const accounts = (await ethereum.request({
          method: "eth_requestAccounts",
        })) as string[];

        const lendingPlatformContract = new web3.eth.Contract(
          lendingPlatformContractABI,
          lendingPlatformContractAddr.address,
        );
        // const eduTokenContract = new web3.eth.Contract(eduTokenContractABI, "0x5FbDB2315678afecb367f032d93F642f64180aa3");

        console.log(
          "lendingPlatformContract Addr: ",
          lendingPlatformContractAddr.address,
        );

        const address = accounts[0];

        // Update state with the results
        setAccountData({
          address,
          eduBalance: web3.utils.fromWei(
            await lendingPlatformContract.methods
              .collateral(accounts[0])
              .call(),
            "ether",
          ), // Convert balance from wei to ether
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

  const nextDay = useCallback(async () => {
    try {
      const web3 = new Web3(window.ethereum);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const priceOracleContractAddress = priceOracleContractAddr.address;
      const instance = new web3.eth.Contract(
        priceOracleContractABI,
        priceOracleContractAddress,
      );

      await instance.methods.advance().send({from: accounts[0]});
      instance.methods
        .getPrice()
        .call<string>()
        .then((price) => {
          const priceInEther = web3.utils.fromWei(price, "ether");
          setPrice(priceInEther);
          console.log("Next day price:", priceInEther);
          alert(`Next day price: ${priceInEther} EDU`);
        }
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          console.error("Error fetching next day price:", error);
          alert(`Error fetching next day price: ${error?.message ?? error}`);
        }
      );
    }
    catch (error) {
      console.error("Error fetching next day price:", error);
    }
  }, []);

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
    <header className="sticky top-0 z-50 py-4 px-6 flex items-center justify-between bg-zinc-100">
      <Link href="/">
        <h1 className="text-2xl font-bold">EduLend</h1>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start">
            <Button onClick={_connectToMetaMask}>
              {!accountData?.address ? "Connect MetaMask" : "Connected"}
            </Button>
            {accountData?.address}
          </DropdownMenuItem>
            <DropdownMenuItem>
                已存入: {accountData?.eduBalance ?? "0"} EDU
            </DropdownMenuItem>
            <DropdownMenuItem>
                已借出: {accountData?.mUSDTBalance ?? "0"} mUSDT
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.replace('/overview')}>Overview</DropdownMenuItem>
          <DropdownMenuItem onClick={nextDay}>next day</DropdownMenuItem>
          <DropdownMenuItem onClick={liquidate}>liquidation</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
