'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Move as MoveIcon, Star, Zap } from "lucide-react";
import { TaskCard } from "./task-card";
import type { Move } from '@/app/(app)/dashboard/page'


const focusMove: Move = {
  id: "focus-1",
  title: "Wireframe key pages",
  priority: "Critical",
  campaign: "Launch Podcast Q4",
  status: "To-Do",
};

const quickWin: Move = {
  id: "quick-1",
  title: "Email team about standup time change",
  priority: "Normal",
  campaign: "General",
  status: "To-Do",
};

export function DailyStrategy({ moves }: { moves: Move[] }) {
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
          <TaskCard move={focusMove} isFocus={true}/>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
            <Zap className="h-4 w-4" />
            Quick Win
          </h3>
          <TaskCard move={quickWin} isQuickWin={true} />
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MoveIcon className="h-4 w-4" />
            Other Moves
          </h3>
          <div className="space-y-2">
            {moves.map((move) => (
              <TaskCard key={move.id} move={move} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
