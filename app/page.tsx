import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 px-4 py-10">
      <main className="w-full max-w-3xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-12">
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl">Zenvist</h1>
        <p className="mt-4 max-w-2xl text-zinc-600">
          Automated visits, real sessions. Schedule website visits, monitor run logs, and review playback artifacts.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/login" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
            Sign in
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800">
            Open dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
