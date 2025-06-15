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
import { usePriceStore } from "@/providers/price-store-provider";
import { useShallow } from "zustand/shallow";

export default function OverviewSection() {
  const chartConfig = {
    price: {
      label: "Interest Rate",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const { prices } = usePriceStore(
    useShallow((state) => ({
      prices: state.prices,
    })),
  );

  const data = prices.map((price, index) => ({
    day: index + 1,
    price,
  }));

  return (
    <div id="overview-section" className="flex flex-col size-full p-6 items-center justify-center bg-zinc-100">
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
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
