"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  TooltipProps,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RevenueChartProps {
  data: {
    date: string;
    total: number;
  }[];
}

interface PayloadItem {
  value?: number;
  name?: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: PayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-md border bg-background p-2 shadow-sm text-sm">
        <p className="mb-1 font-semibold">Date: {label}</p>
        <p>
          Revenue:{" "}
          <span className="font-medium">
            $ {payload[0]?.value?.toLocaleString("uk-UA")}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Revenue by day</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
