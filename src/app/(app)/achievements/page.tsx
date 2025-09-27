'use client';
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAchievements } from "@/lib/achievements-store";
import { BrainCircuit, Check, Medal, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
    const { achievements, potentialAchievements } = useAchievements();

    return (
        <>
            <Header />
            <main className="flex-1 p-4 md:p-8 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Trophy className="text-primary"/>The Grandmaster's Medals</CardTitle>
                         <CardDescription>A collection of honors awarded for your strategic execution and noteworthy accomplishments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {achievements.length === 0 && (
                        <p className="text-muted-foreground">You haven't earned any medals yet. Complete some moves on the dashboard to start your collection!</p>
                       )}
                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {achievements.map((ach) => (
                                <Card key={ach.id} className="flex flex-col">
                                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                            <Medal className="h-8 w-8" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-headline">{ach.title}</CardTitle>
                                            <CardDescription>{ach.description}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="mt-auto">
                                        <p className="text-xs text-muted-foreground">Earned on {ach.date}</p>
                                    </CardContent>
                                </Card>
                            ))}
                       </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><BrainCircuit className="text-primary"/>Potential Medals</CardTitle>
                         <CardDescription>Honors you are close to achieving. Make your next move!</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {potentialAchievements.length === 0 && achievements.length > 0 && (
                        <p className="text-muted-foreground">You've earned all available medals for now. Check back later!</p>
                       )}
                       {potentialAchievements.length === 0 && achievements.length === 0 && (
                        <p className="text-muted-foreground">Complete your first move to see potential medals!</p>
                       )}
                        <div className="space-y-3">
                            {potentialAchievements.map((pot) => (
                                <div key={pot.id} className="p-3 rounded-lg border bg-secondary/50 flex items-center gap-4">
                                     <Check className="h-5 w-5 text-muted-foreground" />
                                     <div className="flex-1">
                                        <p className="font-medium text-sm">{pot.title}</p>
                                        <p className="text-xs text-muted-foreground">{pot.description}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
