import { createServerClient } from '@supabase/ssr';

/**
 * Verifies if a user exists in the Main SkillLinkr application by checking the `profiles` table.
 */
export async function verifyMainSkillLinkrProfile(email: string): Promise<boolean> {
  if (!email) return false;

  const mainSupabase = createServerClient(
    process.env.MAIN_APP_SUPABASE_URL!,
    process.env.MAIN_APP_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {}
      }
    }
  );

  try {
    // Check if the user exists in the Main SkillLinkr profiles table
    // Assuming the profiles table is keyed by email or contains the email
    const { data, error } = await mainSupabase
      .from('profiles')
      .select('id')
      // If profiles table's id is the email (as seen in old auth-helpers.ts: .eq("id", email))
      .eq('id', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      console.error('[main-profile-verifier] Error querying profiles:', error.message);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('[main-profile-verifier] Unexpected error:', error);
    return false;
  }
}
