'use client';
import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { CampaignCreator } from "@/components/dashboard/campaign-creator";
import { DailyStrategy } from "@/components/dashboard/daily-strategy";
import { WeeklyReview } from "@/components/dashboard/weekly-review";
import { TaskCreator } from "@/components/dashboard/task-creator";

// This would typically come from a database
const initialMoves = [
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

export default function DashboardPage() {
  const [moves, setMoves] = useState(initialMoves);

  const addMoves = (newMoves: { title: string }[]) => {
    const movesToAdd = newMoves.map((move, index) => ({
      id: `new-move-${Date.now()}-${index}`,
      title: move.title,
      priority: "Normal" as const,
      campaign: "New Campaign",
      status: "To-Do" as const,
    }));
    setMoves(prevMoves => [...prevMoves, ...movesToAdd]);
  };

  const addTask = (taskTitle: string) => {
    const newTask = {
      id: `new-task-${Date.now()}`,
      title: taskTitle,
      priority: "Normal" as const,
      campaign: "General",
      status: "To-Do" as const,
    };
    setMoves(prevMoves => [newTask, ...prevMoves]);
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <div className="lg:col-span-2 xl:col-span-3 space-y-8">
            <TaskCreator onTaskAdded={addTask} />
            <CampaignCreator onPlanApproved={addMoves} />
            {/* A list of active campaigns could be rendered here */}
          </div>
          <div className="lg:col-span-1 xl:col-span-1 space-y-8">
            <DailyStrategy moves={moves} />
            <WeeklyReview />
          </div>
        </div>
      </main>
    </>
  );
}
