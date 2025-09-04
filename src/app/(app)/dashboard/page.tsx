import { Header } from "@/components/dashboard/header";
import { CampaignCreator } from "@/components/dashboard/campaign-creator";
import { DailyStrategy } from "@/components/dashboard/daily-strategy";
import { WeeklyReview } from "@/components/dashboard/weekly-review";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
        <div className="grid gap-8 lg:grid-cols-3 xl:grid-cols-4">
          <div className="lg:col-span-2 xl:col-span-3 space-y-8">
            <CampaignCreator />
            {/* A list of active campaigns could be rendered here */}
          </div>
          <div className="lg:col-span-1 xl:col-span-1 space-y-8">
            <DailyStrategy />
            <WeeklyReview />
          </div>
        </div>
      </main>
    </>
  );
}
