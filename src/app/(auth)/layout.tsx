import { Crown } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Crown className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">Checkmate</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
