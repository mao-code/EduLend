"use client";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Web3 from "web3";
import {
  priceOracleContractABI,
  priceOracleContractAddr,
} from "@/lib/web3";

export default function OverviewPage() {
  const chartConfig = {
    price: {
      label: "Price",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const [data, setData] = useState<{ day: string; price: number }[]>([]);
  const getInitialPrice = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const priceOracleContractAddress = priceOracleContractAddr.address;
      const instance = new web3.eth.Contract(
        priceOracleContractABI,
        priceOracleContractAddress,
      );
      const price = await instance.methods.getPrice().call();
      return parseFloat(web3.utils.fromWei(String(price), "ether"));
    } catch (error) {
      console.error("Error fetching initial price:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialPrice = await getInitialPrice();
      setData([
        {
          day: new Date().toLocaleDateString(),
          price: initialPrice,
        },
      ]);
    };

    fetchInitialData();
  }, []);

  const nextDay = async () => {
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
      const price = await instance.methods.getPrice().call();
      const formattedPrice = parseFloat(
        web3.utils.fromWei(String(price), "ether"),
      );
      setData((prevData) => {
        const lastDate = prevData.length
          ? new Date(prevData[prevData.length - 1].day)
          : new Date();

        // 加一天
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 1);
        return [
          ...prevData,
          {
            day: nextDate.toLocaleDateString(),
            price: formattedPrice,
          },
        ];
      });

      console.log("Price updated:", data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      console.error("Error fetching initial price:", error);
    }
  };

  return (
    <div className="flex flex-col size-full p-6 items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <Button
        className="mb-4"
        onClick={nextDay}
        variant="outline"
        size="sm"
      >
        Next Day
      </Button>
      <ChartContainer
        config={chartConfig}
        className="grow max-h-full max-w-full"
      >
        <LineChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line dataKey="price" fill="var(--color-price)" radius={4} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
