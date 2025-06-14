"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FuncButtonType } from "./utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import Web3 from "web3";
import {
  lendingPlatformContractABI,
  lendingPlatformContractAddr,
  eduTokenContractABI
} from "@/lib/web3";
import { useAccountStore } from "@/providers/account-store-provider";
import { useShallow } from "zustand/shallow";

interface FuncButtonProps {
  type: FuncButtonType;
}

export default function FuncButton({ type }: FuncButtonProps) {
  const { eduBalance } = useAccountStore(useShallow((state) => ({
          eduBalance: state.account.eduBalance,
  })));
  const [amount, setAmount] = useState<string>("0");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      if (!window.ethereum) {
        throw new Error(
          "Ethereum provider not found. Please install MetaMask or another Ethereum wallet.",
        );
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const web3 = new Web3(window.ethereum);

      const lendingPlatformContract = new web3.eth.Contract(
        lendingPlatformContractABI,
        lendingPlatformContractAddr.address,
      );
      const eduTokenContract = new web3.eth.Contract(
        eduTokenContractABI,
        "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Replace with actual EDU token contract address
      );

      await eduTokenContract.methods
        .approve(lendingPlatformContractAddr.address, web3.utils.toWei(amount, "ether"))
        .send({ from: accounts[0] })
        .then((receipt) => {
          console.log("Approval successful:", receipt);
        })
        .catch((error) => {
          console.error("Approval failed:", error);
        });

      // Handle button click based on the type
      const parsedAmount = web3.utils.toWei(amount, "ether");
      switch (type) {
        case "deposit":
          console.log("Deposit button clicked");
          lendingPlatformContract.methods
            .deposit(parsedAmount)
            .send({ from: accounts[0] })
            .then((receipt) => {
              console.log("Deposit successful:", receipt);
            })
            .catch((error) => {
              console.error("Deposit failed:", error);
            });
          break;
        case "borrow":
          console.log("Borrow button clicked");
          lendingPlatformContract.methods
            .borrow(parsedAmount)
            .send({ from: accounts[0] })
            .then((receipt) => {
              console.log("Borrow successful:", receipt);
            })
            .catch((error) => {
              console.error("Borrow failed:", error);
            });
          break;
        case "repay":
          console.log("Repay button clicked");
          lendingPlatformContract.methods
            .repay(parsedAmount)
            .send({ from: accounts[0] })
            .then((receipt) => {
              console.log("Repay successful:", receipt);
            })
            .catch((error) => {
              console.error("Repay failed:", error);
            });
          break;
        case "redeem":
          console.log("Redeem button clicked");
          lendingPlatformContract.methods
            .redeem(parsedAmount)
            .send({ from: accounts[0] })
            .then((receipt) => {
              console.log("Redeem successful:", receipt);
            })
            .catch((error) => {
              console.error("Redeem failed:", error);
            });
          break;
        default:
          console.error("Unknown button type");
      }
    } catch (error) {
      console.error("Error initializing Web3 or contract instance:", error);
    }
  };

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <div
            id={`${type}-button`}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-100 rounded-full">
              <ChevronRight className="w-6 h-6" />
            </div>
            <p>{type}</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{type}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to {type} in the form below.<br />(balance: {eduBalance} EDU)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              defaultValue="0"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={(e) => handleClick(e)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
