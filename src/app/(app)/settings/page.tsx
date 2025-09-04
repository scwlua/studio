import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <>
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><Settings className="text-primary"/>Settings</CardTitle>
                        <CardDescription>Manage your account settings, preferences, and integrations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Feature coming soon.</p>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
