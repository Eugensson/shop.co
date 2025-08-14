"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type OrdersChartProps = {
  data: {
    date: string;
    count: number;
  }[];
};

interface PayloadItem {
  value: number;
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
          Quantity: <span className="font-medium">{payload[0]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const OrdersChart = ({ data }: OrdersChartProps) => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Orders by day</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
