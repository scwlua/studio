import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Crown, LayoutDashboard, Menu, Settings, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-card">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Crown className="h-6 w-6 text-primary" />
              <span className="font-headline">Checkmate</span>
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link href="/campaigns" className="text-muted-foreground hover:text-primary transition-colors">Campaigns</Link>
            <Link href="/achievements" className="text-muted-foreground hover:text-primary transition-colors">Achievements</Link>
            <Link href="/settings" className="text-muted-foreground hover:text-primary transition-colors">Settings</Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="person avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
