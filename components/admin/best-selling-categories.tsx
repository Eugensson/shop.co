"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CategoryData {
  categoryId: string;
  name: string;
  totalRevenue: number;
}

interface BestSellingCategoriesProps {
  data: CategoryData[];
}

const COLORS = [
  "#4f46e5",
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#db2777",
  "#ea580c",
  "#0369a1",
  "#9333ea",
] as const;

type Color = (typeof COLORS)[number];

interface CustomLegendPayload {
  value: string;
  color: Color;
  payload: CategoryData;
}

const CustomLegend = ({ payload }: { payload?: CustomLegendPayload[] }) => {
  if (!payload?.length) return null;

  return (
    <ul className="mt-4 space-y-1 text-sm">
      {payload.map((entry, i) => (
        <li key={i} className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium">{entry.value}</span>
          <span className="text-muted-foreground">
            — $ {entry.payload.totalRevenue.toLocaleString("en-US")}
          </span>
        </li>
      ))}
    </ul>
  );
};

export const BestSellingCategories = ({ data }: BestSellingCategoriesProps) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data to display</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const legendPayload: CustomLegendPayload[] = data.map((entry, idx) => ({
    value: entry.name,
    color: COLORS[idx % COLORS.length] as Color,
    payload: entry,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best selling categories</CardTitle>
      </CardHeader>

      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="totalRevenue"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length] as Color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(v: number) => `₴ ${v.toLocaleString("uk-UA")}`}
            />

            <CustomLegend payload={legendPayload} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
