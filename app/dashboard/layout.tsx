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
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-lg font-semibold text-zinc-900">
            Zenvist
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-700">
            <Link href="/dashboard/jobs">Jobs</Link>
            <Link href="/dashboard/logs">Logs</Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="rounded-lg border border-zinc-300 px-3 py-1.5">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
