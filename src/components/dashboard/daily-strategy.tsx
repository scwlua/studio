import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Move, Star, Zap } from "lucide-react";
import { TaskCard } from "./task-card";

const focusMove = {
  id: "focus-1",
  title: "Wireframe key pages",
  priority: "Critical" as const,
  campaign: "Launch Podcast Q4",
  status: "To-Do" as const,
  isFocus: true,
};

const quickWin = {
  id: "quick-1",
  title: "Email team about standup time change",
  priority: "Normal" as const,
  campaign: "General",
  status: "To-Do" as const,
  isQuickWin: true,
};

const otherMoves = [
  {
    id: "other-1",
    title: "Review Q3 performance data",
    priority: "High" as const,
    campaign: "Get Promotion",
    status: "In Progress" as const,
  },
  {
    id: "other-2",
    title: "Draft first episode script",
    priority: "High" as const,
    campaign: "Launch Podcast Q4",
    status: "To-Do" as const,
  },
];

export function DailyStrategy() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Next Moves</CardTitle>
        <CardDescription>AI-powered recommendations for today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
            <Star className="h-4 w-4" />
            Focus Move
          </h3>
          <TaskCard move={focusMove} />
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
            <Zap className="h-4 w-4" />
            Quick Win
          </h3>
          <TaskCard move={quickWin} />
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Move className="h-4 w-4" />
            Other Moves
          </h3>
          <div className="space-y-2">
            {otherMoves.map((move) => (
              <TaskCard key={move.id} move={move} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
