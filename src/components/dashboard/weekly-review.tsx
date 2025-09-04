'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, Trophy } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

const chartData = [
  { day: "Mon", moves: 4 },
  { day: "Tue", moves: 3 },
  { day: "Wed", moves: 5 },
  { day: "Thu", moves: 2 },
  { day: "Fri", moves: 6 },
  { day: "Sat", moves: 1 },
  { day: "Sun", moves: 0 },
];

const chartConfig = {
  moves: {
    label: "Moves",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function WeeklyReview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BarChartIcon className="h-5 w-5" />
          Weekly Endgame
        </CardTitle>
        <CardDescription>Your performance analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-sm mb-2">Moves Completed</h4>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="moves" fill="var(--color-moves)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Productivity Analysis</h4>
            <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md border">
              <span className="font-bold text-foreground">Insight:</span> You are 30% more effective at creative tasks before 11 AM.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Achievements</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="border-primary/50 text-primary py-1 px-3">
                <Trophy className="h-4 w-4 mr-2" /> 5-Move Win Streak!
              </Badge>
              <Badge variant="secondary" className="border-green-500/50 text-green-400 py-1 px-3">
                <Trophy className="h-4 w-4 mr-2" /> Campaign Conquered!
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
