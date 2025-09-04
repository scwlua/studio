'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { Campaign as CampaignType } from "@/app/(app)/dashboard/page";
import { TaskCard } from "./task-card";

interface CampaignProps {
    campaign: CampaignType;
}

export function Campaign({ campaign }: CampaignProps) {
    if (!campaign) {
        return null;
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Target className="text-primary"/>{campaign.title}</CardTitle>
                <CardDescription>A set of moves to achieve your objective.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {campaign.moves.map(move => (
                    <TaskCard key={move.id} move={move} />
                ))}
            </CardContent>
        </Card>
    )
}
