'use client';
import { Header } from "@/components/dashboard/header";
import { CampaignCreator, CampaignPlan } from "@/components/dashboard/campaign-creator";
import { DailyStrategy } from "@/components/dashboard/daily-strategy";
import { WeeklyReview } from "@/components/dashboard/weekly-review";
import { TaskCreator } from "@/components/dashboard/task-creator";
import { Campaign as CampaignComponent } from "@/components/dashboard/campaign";
import { useCampaigns, campaignStore } from "@/lib/campaign-store";
import { useState } from "react";

export type Move = {
  id: string;
  title: string;
  priority: "Critical" | "High" | "Normal";
  campaignId: string;
  campaignTitle: string;
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
    campaignId: "campaign-promo",
    campaignTitle: "Get Promotion",
    status: "In Progress",
  },
  {
    id: "other-2",
    title: "Draft first episode script",
    priority: "High",
    campaignId: "campaign-podcast",
    campaignTitle: "Launch Podcast Q4",
    status: "To-Do",
  },
];

export default function DashboardPage() {
  const [moves, setMoves] = useState(initialMoves);
  const campaigns = useCampaigns();
  
  const addCampaign = (plan: CampaignPlan) => {
    const campaignId = `campaign-${Date.now()}`;
    const newCampaign: Campaign = {
        id: campaignId,
        title: plan.goal,
        moves: plan.moves.map((move, index) => ({
            id: `move-${Date.now()}-${index}`,
            title: move.task,
            priority: move.priority,
            campaignId: campaignId,
            campaignTitle: plan.goal,
            status: "To-Do",
            dueDate: move.dueDate,
            resources: move.resources,
        }))
    };
    campaignStore.addCampaign(newCampaign);
  };

  const addTask = (taskTitle: string) => {
    const newTask: Move = {
      id: `new-task-${Date.now()}`,
      title: taskTitle,
      priority: "Normal",
      campaignId: "campaign-general",
      campaignTitle: "General",
      status: "To-Do",
    };
    // This will not persist currently as it's not part of a campaign
    // For a real app, we'd add this to a default "General" campaign in the store
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
