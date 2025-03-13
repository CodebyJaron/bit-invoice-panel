"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
    paid: {
        label: "Betaald",
        color: "hsl(var(--chart-1))",
    },
    pending: {
        label: "Openstaand",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

interface InvoiceChartProps {
    data: { month: string; paid: number; pending: number }[];
}

export function InvoiceChart({ data }: InvoiceChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Factuurgrafiek</CardTitle>
                <CardDescription>
                    Deze grafiek geeft een helder overzicht van het aantal
                    betaalde en openstaande facturen per maand.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="paid"
                            fill="var(--color-desktop)"
                            radius={4}
                        />
                        <Bar
                            dataKey="pending"
                            fill="var(--color-mobile)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
