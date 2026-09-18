import { TrendingDownIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@components/ui/chart";

import { labourCost } from "./chart-data";

const chartConfig = {
  frontOfHouse: {
    label: "Front of house",
    color: "var(--chart-2)",
  },
  backOfHouse: {
    label: "Back of house",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export function LabourCostChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Labour cost</CardTitle>
        <CardDescription>Wages paid, by area of the business</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={labourCost}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig].label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {currency.format(value as number)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <defs>
              <linearGradient id="fillFrontOfHouse" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-frontOfHouse)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-frontOfHouse)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillBackOfHouse" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-backOfHouse)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-backOfHouse)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="backOfHouse"
              type="natural"
              fill="url(#fillBackOfHouse)"
              stroke="var(--color-backOfHouse)"
              stackId="a"
            />
            <Area
              dataKey="frontOfHouse"
              type="natural"
              fill="url(#fillFrontOfHouse)"
              stroke="var(--color-frontOfHouse)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Down 6.9% from August
          <TrendingDownIcon className="size-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          April – September 2026
        </div>
      </CardFooter>
    </Card>
  );
}
