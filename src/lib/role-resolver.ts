import { createAdminClient } from './supabase-server';
import { resolveCollegeFromEmail } from './college-resolver';
import { verifyMainSkillLinkrProfile } from './main-profile-verifier';

export type RoleCandidate = 'admin' | 'super_admin' | 'ambassador' | 'society' | 'society_candidate' | 'denied';

export interface IdentityResolution {
  role: RoleCandidate;
  college?: { id: string; name: string };
  invitationId?: string;
  onboardingCompleted: boolean;
  mainProfileExists: boolean;
  reason?: string;
}

/**
 * Resolves the role and status of an authenticated user based on their email.
 * This is the SINGLE SOURCE OF TRUTH for role determination in OMS.
 */
export async function resolveOmsIdentity(email: string): Promise<IdentityResolution> {
  const normalizedEmail = email.toLowerCase().trim();
  const supabase = await createAdminClient();

  // Default state
  let mainProfileExists = false;
  let onboardingCompleted = false;

  // Check if they already have an active opp_users account
  const { data: existingUser } = await supabase
    .from('opp_users')
    .select('id, role, status, onboarding_completed')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existingUser) {
    if (existingUser.status === 'suspended') {
      return { role: 'denied', reason: 'Account suspended', onboardingCompleted: false, mainProfileExists: false };
    }
    
    // Check if they are an admin first
    const { data: adminMatch } = await supabase
      .from('opp_admin_allowlist')
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .maybeSingle();
      
    if (adminMatch && adminMatch.is_active) {
      return {
        role: 'admin',
        onboardingCompleted: existingUser.onboarding_completed,
        mainProfileExists: true
      };
    }
    
    let finalOnboardingStatus = existingUser.onboarding_completed;
    let college = undefined;

    // Defensive check: If they are a society and marked as completed, verify opp_societies exists
    if (existingUser.role === 'society') {
      const { data: societyRecord } = await supabase
        .from('opp_societies')
        .select('id, college_id, opp_colleges(name)')
        .eq('user_id', existingUser.id || '')
        .maybeSingle();
      
      if (!societyRecord && finalOnboardingStatus) {
        finalOnboardingStatus = false;
      }
      if (societyRecord) {
        const collegeData = Array.isArray(societyRecord.opp_colleges) ? societyRecord.opp_colleges[0] : societyRecord.opp_colleges;
        college = { id: societyRecord.college_id, name: collegeData?.name || 'Unknown College' };
      } else {
        // Fallback to domain resolution
        const collegeMatch = await resolveCollegeFromEmail(normalizedEmail);
        if (collegeMatch) college = { id: collegeMatch.id, name: collegeMatch.name };
      }
    } else if (existingUser.role === 'ambassador') {
      const { data: ambRecord } = await supabase
        .from('opp_ambassadors')
        .select('id, college_id, opp_colleges(name)')
        .eq('user_id', existingUser.id || '')
        .maybeSingle();
      
      if (!ambRecord && finalOnboardingStatus) {
        finalOnboardingStatus = false;
      }
      if (ambRecord) {
        const collegeData = Array.isArray(ambRecord.opp_colleges) ? ambRecord.opp_colleges[0] : ambRecord.opp_colleges;
        college = { id: ambRecord.college_id, name: collegeData?.name || 'Unknown College' };
      } else {
        // Fallback to invitation resolution
        const { data: ambMatch } = await supabase.from('opp_ambassador_invitations').select('college_id, opp_colleges(name)').eq('email', normalizedEmail).maybeSingle();
        if (ambMatch) {
            const collegeData = Array.isArray(ambMatch.opp_colleges) ? ambMatch.opp_colleges[0] : ambMatch.opp_colleges;
            college = { id: ambMatch.college_id, name: collegeData?.name || 'Unknown College' };
        }
      }
    }

    // Otherwise return their stored role
    return {
      role: existingUser.role as RoleCandidate,
      onboardingCompleted: finalOnboardingStatus,
      college,
      mainProfileExists: true
    };
  }

  // STEP 1: Check Admin Allowlist
  const { data: adminMatch } = await supabase
    .from('opp_admin_allowlist')
    .select('id, is_active')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (adminMatch && adminMatch.is_active) {
    return {
      role: 'admin',
      onboardingCompleted,
      mainProfileExists: false // Not strictly required for admins
    };
  }

  // STEP 2: Check Ambassador Invitations
  const { data: ambassadorMatch } = await supabase
    .from('opp_ambassador_invitations')
    .select('id, status, college_id, opp_colleges(name)')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (ambassadorMatch) {
    if (ambassadorMatch.status === 'suspended') {
      return { role: 'denied', reason: 'Ambassador invitation suspended', onboardingCompleted: false, mainProfileExists: false };
    }
    
    // We get the college name via the join
    const collegeData = Array.isArray(ambassadorMatch.opp_colleges) 
      ? ambassadorMatch.opp_colleges[0] 
      : ambassadorMatch.opp_colleges;

    return {
      role: 'ambassador',
      invitationId: ambassadorMatch.id,
      college: {
        id: ambassadorMatch.college_id,
        name: collegeData?.name || 'Unknown College'
      },
      onboardingCompleted,
      mainProfileExists: false
    };
  }

  // STEP 3: Check Society Eligibility
  // 3a. Verify Main SkillLinkr Profile exists
  mainProfileExists = await verifyMainSkillLinkrProfile(normalizedEmail);
  
  if (!mainProfileExists) {
    return {
      role: 'denied',
      reason: 'No Main SkillLinkr profile found',
      onboardingCompleted: false,
      mainProfileExists
    };
  }

  // 3b. Verify email belongs to an active supported university domain
  const collegeMatch = await resolveCollegeFromEmail(normalizedEmail);
  
  if (collegeMatch) {
    return {
      role: 'society_candidate',
      college: {
        id: collegeMatch.id,
        name: collegeMatch.name
      },
      onboardingCompleted,
      mainProfileExists
    };
  }

  // STEP 4: Fallback Deny (e.g., generic emails like @gmail.com)
  return {
    role: 'denied',
    reason: 'Email domain not supported for Societies and no special invitation found',
    onboardingCompleted: false,
    mainProfileExists
  };
}
