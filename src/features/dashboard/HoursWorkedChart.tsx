import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import { hoursWorked } from "./chart-data";

const chartConfig = {
  hours: {
    label: "Hours",
  },
  regular: {
    label: "Regular",
    color: "var(--chart-2)",
  },
  overtime: {
    label: "Overtime",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const ranges = [
  { value: "90d", label: "Last 3 months", days: 90 },
  { value: "30d", label: "Last 30 days", days: 30 },
  { value: "7d", label: "Last 7 days", days: 7 },
];

const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function HoursWorkedChart() {
  const [range, setRange] = useState(ranges[0].value);

  const { data, total } = useMemo(() => {
    const days = ranges.find((item) => item.value === range)?.days ?? 90;
    const data = hoursWorked.slice(-days);
    const total = data.reduce(
      (sum, day) => sum + day.regular + day.overtime,
      0,
    );
    return { data, total };
  }, [range]);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Hours worked</CardTitle>
        <CardDescription>
          {total.toLocaleString()} hours logged across every location
        </CardDescription>
        <CardAction>
          <Select
            items={ranges}
            value={range}
            onValueChange={(value) => setRange(value as string)}
          >
            <SelectTrigger className="w-40" aria-label="Select a time range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ranges.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <AreaChart accessibilityLayer data={data}>
            <defs>
              <linearGradient id="fillRegular" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-regular)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-regular)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOvertime" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-overtime)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-overtime)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => dayFormat.format(new Date(value))}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    dayFormat.format(new Date(value as string))
                  }
                />
              }
            />
            <Area
              dataKey="overtime"
              type="natural"
              fill="url(#fillOvertime)"
              stroke="var(--color-overtime)"
              stackId="a"
            />
            <Area
              dataKey="regular"
              type="natural"
              fill="url(#fillRegular)"
              stroke="var(--color-regular)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
