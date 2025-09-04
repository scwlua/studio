import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Crown className="h-6 w-6 text-primary" />
          <span className="font-headline ml-2 text-lg font-bold">Checkmate</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link
              href="/login"
              className="text-sm font-medium hover:underline underline-offset-4"
              prefetch={false}
            >
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Stop listing chores. Start winning your day.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Checkmate is your AI-powered grandmaster, transforming overwhelming goals into a clear, winnable game. Make your move.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      Claim Your Board
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/600/600"
                width="600"
                height="600"
                alt="Hero"
                data-ai-hint="chess abstract"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
