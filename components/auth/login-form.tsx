"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { env } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  async function onMagicLink() {
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: env.authRedirectUrl,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setMessage("Magic link sent. Check your email.");
  }

  async function onSignUp() {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!password || password.length < 6) {
      setLoading(false);
      setError("Use at least 6 characters for password when signing up.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: env.authRedirectUrl,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setMessage("Signup successful. Check your email to confirm your account.");
  }

  return (
    <form onSubmit={onSignIn} className="space-y-6 rounded-3xl border border-accent/40 bg-white/70 backdrop-blur-xl p-8 shadow-xl shadow-primary/5 ring-1 ring-inset ring-accent/30 sm:p-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-dark">Welcome back</h1>
        <p className="mt-2 text-sm text-dark/70">Sign in to your account, or request a magic link.</p>
      </div>

      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-dark/80 mb-1.5" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-accent/60 bg-white/50 px-4 py-2.5 text-sm text-dark placeholder:text-dark/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark/80 mb-1.5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-accent/60 bg-white/50 px-4 py-2.5 text-sm text-dark placeholder:text-dark/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-error/10 p-3 text-sm text-error font-medium ring-1 ring-inset ring-error/20 flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
           {error}
        </div>
      ) : null}
      {message ? (
        <div className="rounded-lg bg-success/10 p-3 text-sm text-emerald-800 font-medium ring-1 ring-inset ring-success/20 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 pt-2">
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          disabled={loading || !email}
          type="button"
          onClick={onMagicLink}
          className="w-full rounded-xl border border-accent/80 bg-white px-4 py-3 text-sm font-semibold text-dark/90 shadow-sm hover:bg-light hover:border-accent transition-all duration-300 disabled:opacity-50"
        >
          Send magic link
        </button>
        <div className="mt-2 text-center text-sm">
          <span className="text-dark/60">Don&apos;t have an account? </span>
           <button
             disabled={loading || !email}
             type="button"
             onClick={onSignUp}
             className="font-semibold text-primary hover:text-secondary hover:underline transition-colors disabled:opacity-50"
           >
             Sign up
           </button>
           <div className="mt-1 text-xs text-dark/40">(Enter email/password above to sign up)</div>
        </div>
      </div>
    </form>
  );
}
