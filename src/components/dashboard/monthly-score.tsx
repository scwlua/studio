'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as BarChartIcon, Medal } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useCampaigns } from "@/lib/campaign-store";
import { useMemo } from "react";
import type { Move } from "@/app/(app)/dashboard/page";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function calculateMonthlyScores(moves: Move[]) {
    const scores: { [month: string]: { created: number, completed: number } } = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize scores for the last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        scores[monthKey] = { created: 0, completed: 0 };
    }

    moves.forEach(move => {
        const createdAt = new Date(move.createdAt);
        const monthKey = `${monthNames[createdAt.getMonth()]} ${createdAt.getFullYear()}`;
        if (scores[monthKey]) {
            scores[monthKey].created++;
        }

        if (move.completedAt) {
            const completedAt = new Date(move.completedAt);
            const completedMonthKey = `${monthNames[completedAt.getMonth()]} ${completedAt.getFullYear()}`;
            if (scores[completedMonthKey]) {
                scores[completedMonthKey].completed++;
            }
        }
    });

    const chartData = Object.entries(scores).map(([month, data]) => ({
        month,
        score: data.created > 0 ? Math.round((data.completed / data.created) * 100) : 0,
    }));
    
    return chartData;
}


export function MonthlyScore() {
  const campaigns = useCampaigns();
  const allMoves = useMemo(() => campaigns.flatMap(c => c.moves), [campaigns]);
  const scoreData = useMemo(() => calculateMonthlyScores(allMoves), [allMoves]);

  const currentMonthData = scoreData.length > 0 ? scoreData[scoreData.length - 1] : { month: 'N/A', score: 0 };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Medal className="h-5 w-5" />
          Monthly Score
        </CardTitle>
        <CardDescription>Your completion score for the month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold tracking-tighter text-primary">{currentMonthData.score}</span>
            <span className="text-xl font-medium text-muted-foreground">/ 100</span>
        </div>
        <ChartContainer config={chartConfig} className="h-[150px] w-full">
            <BarChart accessibilityLayer data={scoreData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="score" fill="var(--color-score)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
