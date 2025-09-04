import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function CampaignsPage() {
    return (
        <>
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Target className="text-primary"/>Campaigns</CardTitle>
                        <CardDescription>This is where you would manage your long-term goals or "Campaigns".</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Feature coming soon.</p>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
