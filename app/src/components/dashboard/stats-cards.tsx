import {
  Card,
  CardContent,
} from "@/components/ui/card";

const stats = [
  {
    title: "Total Revenue",
    value: "$12,450",
  },
  {
    title: "Clients",
    value: "124",
  },
  {
    title: "Projects",
    value: "37",
  },
  {
    title: "Pending",
    value: "8",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="rounded-none"
        >
          <CardContent className="p-6">
            <p className="text-sm opacity-60">
              {stat.title}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {stat.value}
            </h2>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}