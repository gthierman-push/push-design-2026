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

import { overtime } from "./chart-data";

const chartConfig = {
  hours: {
    label: "Overtime hours",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function OvertimeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overtime</CardTitle>
        <CardDescription>
          Hours paid above the standard work week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={overtime}
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
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="hours"
              type="step"
              fill="var(--color-hours)"
              fillOpacity={0.4}
              stroke="var(--color-hours)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Down 33% since the summer peak
          <TrendingDownIcon className="size-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          April – September 2026
        </div>
      </CardFooter>
    </Card>
  );
}
