import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: number | string;
};

export const KpiCard = ({ title, value }: KpiCardProps) => (
  <Card className="p-4">
    <CardHeader>
      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{value}</p>
    </CardContent>
  </Card>
);
