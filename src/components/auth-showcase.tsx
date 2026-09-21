import { TrendingDownIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@components/ui/chart";

/**
 * The product shot on the auth pages: one card lifted off a primary-alt field,
 * showing a single month-by-month series. Its own fixture rather than the
 * dashboard's -- the copy and the chart tell one story, so they live together.
 */
const overtime = [
  { month: "April", hours: 214 },
  { month: "May", hours: 268 },
  { month: "June", hours: 341 },
  { month: "July", hours: 402 },
  { month: "August", hours: 368 },
  { month: "September", hours: 246 },
];

const chartConfig = {
  hours: {
    label: "Overtime hours",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const latest = overtime[overtime.length - 1];
const peak = overtime.reduce((a, b) => (b.hours > a.hours ? b : a));

export function AuthShowcase() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="text-primary-alt-foreground flex flex-col gap-3">
        <h2 className="font-heading text-2xl leading-snug font-medium text-balance">
          Every hour, accounted for.
        </h2>
        <p className="text-sm opacity-70">
          Scheduling, time tracking and payroll in one place, so overtime stops
          being a surprise at the end of the month.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Overtime hours</CardTitle>
          <CardDescription>Across every location</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-medium tabular-nums">
                {latest.hours}
              </span>
              <span className="text-muted-foreground text-sm">
                hours in {latest.month}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <TrendingDownIcon className="size-4" />
              Down from {peak.hours} at the {peak.month} peak
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-40 w-full"
          >
            <BarChart accessibilityLayer data={overtime}>
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
              <Bar
                dataKey="hours"
                fill="var(--color-hours)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
