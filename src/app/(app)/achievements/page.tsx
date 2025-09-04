import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function AchievementsPage() {
    return (
        <>
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Trophy className="text-primary"/>Achievements</CardTitle>
                         <CardDescription>Track your accomplishments and milestones.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Feature coming soon.</p>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
