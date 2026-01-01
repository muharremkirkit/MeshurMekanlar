
import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key || url === "undefined" || key === "undefined" || url === "" || key === "") {
    return null;
  }

  try {
    return createClient(url, key);
  } catch (e) {
    console.error("Supabase başlatma hatası:", e);
    return null;
  }
};

export const supabase = getSupabase();

if (!supabase) {
  console.log("UYARI: SaaS özellikleri (Bulut Kayıt) devre dışı. Veriler tarayıcıda saklanacak.");
}
