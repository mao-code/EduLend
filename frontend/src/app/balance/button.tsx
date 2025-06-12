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
} from "@/lib/web3";

interface FuncButtonProps {
  type: FuncButtonType;
}

export default function FuncButton({ type }: FuncButtonProps) {
  const [amount, setAmount] = useState<string>("0");

  const handleClick = async () => {
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

      // Handle button click based on the type
      const parsedAmount = web3.utils.toWei(amount, "ether");
      switch (type) {
        case "deposit":
          console.log("Deposit button clicked");
          instance.methods
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
          instance.methods
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
          instance.methods
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
          instance.methods
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
            <Button size="icon">
              <ChevronRight />
            </Button>
            <p>{type}</p>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{type}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to {type} in the form below.
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
            <Button type="submit" onClick={handleClick}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
