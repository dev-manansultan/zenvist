function required(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  cronSecret: process.env.CRON_SECRET,
  batchSize: Number(process.env.BATCH_SIZE ?? 5),
  maxDurationSec: Number(process.env.MAX_DURATION_SEC ?? 120),
};
