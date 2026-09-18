import { TrendingUpIcon } from "lucide-react";
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

import { coverage } from "./chart-data";

const chartConfig = {
  open: {
    label: "Open shifts",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const fillRate = (month: (typeof coverage)[number]) =>
  (100 * month.filled) / (month.filled + month.open);

const latestRate = fillRate(coverage[coverage.length - 1]);
const priorRate = fillRate(coverage[coverage.length - 2]);

export function OpenShiftsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open shifts</CardTitle>
        <CardDescription>
          Published shifts that nobody picked up
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={coverage}
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillOpen" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-open)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-open)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="open"
              type="natural"
              fill="url(#fillOpen)"
              stroke="var(--color-open)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {latestRate.toFixed(1)}% of September shifts filled, up from{" "}
          {priorRate.toFixed(1)}%
          <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          April – September 2026
        </div>
      </CardFooter>
    </Card>
  );
}
