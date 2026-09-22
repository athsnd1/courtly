import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/react";

export const useSupabase = () => {
  const { getToken } = useAuth();

  return createClient(
    import.meta.env.VITE_SUPABASE_PROJECT_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      accessToken: async () => {
        return await getToken();
      },
    }
  );
};