'use client'
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function OverviewPage() {
    const chartConfig = {
        price: {
            label: "Price",
            color: "#2563eb",
        },
    } satisfies ChartConfig

    const chartData = [
        { day: "first", price: 186 },
        { day: "second", price: 305 },
        { day: "thrid", price: 237 },
        { day: "fourth", price: 73 },
        { day: "fifth", price: 209 },
    ]


    return (
        <div className="flex flex-col size-full p-6 items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Overview</h1>
            <ChartContainer config={chartConfig} className="grow max-h-full max-w-full">
                <LineChart accessibilityLayer data={chartData}>
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
};