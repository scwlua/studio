import { Sidebar } from "@/components/dashboard/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
