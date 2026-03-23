import Link from "next/link";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-light/60 font-sans text-dark flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-accent/30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-sm ring-1 ring-primary/20 transition-transform group-hover:scale-105">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-dark">Zenvist</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              <Link href="/dashboard/jobs" className="rounded-md px-3 py-2 text-sm font-medium text-dark/70 hover:bg-accent/20 hover:text-dark transition-colors">Jobs</Link>
              <Link href="/dashboard/logs" className="rounded-md px-3 py-2 text-sm font-medium text-dark/70 hover:bg-accent/20 hover:text-dark transition-colors">Logs</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-dark/80">
            {/* Mobile nav fallback - simplify by keeping visible if needed, but flex-col hides on small screens */}
            <div className="md:hidden flex items-center gap-2 mr-2">
              <Link href="/dashboard/jobs" className="text-sm font-medium text-dark/70">Jobs</Link>
              <span className="text-accent">|</span>
              <Link href="/dashboard/logs" className="text-sm font-medium text-dark/70">Logs</Link>
            </div>
            
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="flex items-center gap-2 rounded-full border border-accent/80 bg-white px-4 py-1.5 text-sm font-semibold text-dark/80 hover:bg-light transition-colors hover:text-error/90">
                <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12 flex-1">{children}</main>
    </div>
  );
}
