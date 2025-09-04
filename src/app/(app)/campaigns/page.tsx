
'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/dashboard/header";
import { Campaign } from "@/components/dashboard/campaign";
import type { Campaign as CampaignType } from "@/app/(app)/dashboard/page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function CampaignsPage() {
    const searchParams = useSearchParams();
    const campaignsString = searchParams.get('campaigns');
    const campaigns: CampaignType[] = campaignsString ? JSON.parse(campaignsString) : [];

    return (
        <>
            <Header />
            <main className="flex-1 p-4 md:p-8 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Target className="text-primary"/>Campaigns</CardTitle>
                        <CardDescription>This is where you manage your long-term goals or "Campaigns".</CardDescription>
                    </CardHeader>
                </Card>
                {campaigns.length > 0 ? (
                    campaigns.map(campaign => (
                        <Campaign key={campaign.id} campaign={campaign} />
                    ))
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">You haven't created any campaigns yet. Go to the dashboard to start a new one!</p>
                        </CardContent>
                    </Card>
                )}
            </main>
        </>
    )
}
