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
    <form onSubmit={onSignIn} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-zinc-900">Sign in to Zenvist</h1>
      <p className="text-sm text-zinc-600">Sign in, create an account, or request a magic link.</p>

      <label className="block text-sm font-medium text-zinc-700" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />

      <label className="block text-sm font-medium text-zinc-700" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          disabled={loading}
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <button
          disabled={loading || !email}
          type="button"
          onClick={onSignUp}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 disabled:opacity-50"
        >
          Create account
        </button>
        <button
          disabled={loading || !email}
          type="button"
          onClick={onMagicLink}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 disabled:opacity-50"
        >
          Send magic link
        </button>
      </div>
    </form>
  );
}
