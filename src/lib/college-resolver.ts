import { createAdminClient } from './supabase-server';

export type College = {
  id: string;
  name: string;
  code: string;
  email_domain: string;
};

/**
 * Resolves an email address to a college by querying the database.
 * This is the single source of truth for email domain to college mapping.
 */
export async function resolveCollegeFromEmail(email: string): Promise<College | null> {
  if (!email || !email.includes('@')) {
    return null;
  }

  const domain = email.split('@')[1].toLowerCase().trim();
  
  if (!domain) {
    return null;
  }

  const supabase = await createAdminClient();

  // Find exact domain match, or if the email domain ends with '.domain' (subdomains)
  // For simplicity and exact match requirement from spec (SECTION 5), we'll do exact matching first.
  const { data: colleges, error } = await supabase
    .from('opp_colleges')
    .select('id, name, code, email_domain')
    .eq('is_active', true);

  if (error || !colleges) {
    console.error('[college-resolver] Failed to fetch colleges:', error?.message);
    return null;
  }

  // Find the matching college based on domain rules
  const matchedCollege = colleges.find(c => {
    const cDomain = c.email_domain.toLowerCase().trim();
    return domain === cDomain || domain.endsWith('.' + cDomain);
  });

  return matchedCollege || null;
}
