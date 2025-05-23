'use client'
import { Button } from "@/components/ui/button";
import type { FuncButtonType } from "./utils";
import { ChevronRight } from "lucide-react";

interface FuncButtonProps {
  type: FuncButtonType;
}

export default function FuncButton({ type }: FuncButtonProps) {
    const handleClick = () => {
        // Handle button click based on the type
        switch (type) {
        case "deposit":
            console.log("Deposit button clicked");
            break;
        case "borrow":
            console.log("Borrow button clicked");
            break;
        case "repay":
            console.log("Repay button clicked");
            break;
        case "redeem":
            console.log("Redeem button clicked");
            break;
        default:
            console.error("Unknown button type");
        }
    };

  return (
    <div className="flex flex-col gap-1 items-center">
        <Button size="icon" onClick={handleClick}>{<ChevronRight />}</Button>
        <p>{type}</p>
    </div>
  );

}