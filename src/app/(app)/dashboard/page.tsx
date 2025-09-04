'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { CampaignCreator, CampaignPlan } from "@/components/dashboard/campaign-creator";
import { DailyStrategy } from "@/components/dashboard/daily-strategy";
import { WeeklyReview } from "@/components/dashboard/weekly-review";
import { TaskCreator } from "@/components/dashboard/task-creator";
import { Campaign as CampaignComponent } from "@/components/dashboard/campaign";

export type Move = {
  id: string;
  title: string;
  priority: "Critical" | "High" | "Normal";
  campaign: string;
  status: "To-Do" | "In Progress" | "Done";
  dueDate?: string;
  resources?: string[];
};

export type Campaign = {
    id: string;
    title: string;
    moves: Move[];
};


// This would typically come from a database
const initialMoves: Move[] = [
  {
    id: "other-1",
    title: "Review Q3 performance data",
    priority: "High",
    campaign: "Get Promotion",
    status: "In Progress",
  },
  {
    id: "other-2",
    title: "Draft first episode script",
    priority: "High",
    campaign: "Launch Podcast Q4",
    status: "To-Do",
  },
];

const initialCampaigns: Campaign[] = [];

export default function DashboardPage() {
  const [moves, setMoves] = useState(initialMoves);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const router = useRouter();

  useEffect(() => {
    if (campaigns.length > 0) {
      const campaignsString = JSON.stringify(campaigns);
      router.push(`/campaigns?campaigns=${encodeURIComponent(campaignsString)}`);
    }
  }, [campaigns, router]);

  const addCampaign = (plan: CampaignPlan) => {
    const newCampaign: Campaign = {
        id: `campaign-${Date.now()}`,
        title: plan.goal,
        moves: plan.moves.map((move, index) => ({
            id: `move-${Date.now()}-${index}`,
            title: move.task,
            priority: "Normal",
            campaign: plan.goal,
            status: "To-Do",
            dueDate: move.dueDate,
            resources: move.resources,
        }))
    };
    setCampaigns(prevCampaigns => [...prevCampaigns, newCampaign]);
  };

  const addTask = (taskTitle: string) => {
    const newTask: Move = {
      id: `new-task-${Date.now()}`,
      title: taskTitle,
      priority: "Normal",
      campaign: "General",
      status: "To-Do",
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
            <CampaignCreator onPlanApproved={addCampaign} />
            {campaigns.map(campaign => (
                <CampaignComponent key={campaign.id} campaign={campaign} />
            ))}
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
