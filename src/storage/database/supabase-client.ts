import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

function getSupabaseCredentials(): SupabaseCredentials {
  // 在前端环境中，直接使用默认配置
  // 实际部署时需要在 Vercel 或其他平台设置环境变量
  const url = 'https://egutrdawrbziyklwnuov.supabase.co';
  const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndXRyZGF3cmJ6aXlrbHdudW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjUwMTEsImV4cCI6MjA4ODAwMTAxMX0.PKGOVO2ItYvesw714VRdGxuTjGgNw5WU2LHTDLObQfs';

  return { url, anonKey };
}

export function getSupabaseClient(token?: string): SupabaseClient {
  const { url, anonKey } = getSupabaseCredentials();

  if (token) {
    return createClient(url, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      db: {
        timeout: 60000,
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createClient(url, anonKey, {
    db: {
      timeout: 60000,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
