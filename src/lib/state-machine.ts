import { RoleCandidate } from './role-resolver'; // We only care about actual roles, we'll redefine if needed

export type OpportunityStatus = 'draft' | 'submitted' | 'under_review' | 'correction_requested' | 'correction_submitted' | 'approved' | 'published' | 'rejected' | 'archived';

const allowedTransitions: Record<RoleCandidate, Record<OpportunityStatus, OpportunityStatus[]>> = {
  admin: {
    draft: ['submitted', 'published'],
    submitted: ['under_review', 'approved', 'published', 'rejected', 'correction_requested'],
    under_review: ['approved', 'published', 'rejected', 'correction_requested'],
    correction_requested: [], // Admin shouldn't manually set this from this state
    correction_submitted: ['under_review', 'approved', 'published', 'rejected', 'correction_requested'],
    approved: ['published', 'archived'],
    published: ['archived'],
    rejected: [],
    archived: ['published']
  },
  ambassador: {
    draft: ['submitted'],
    submitted: ['under_review', 'published', 'rejected', 'correction_requested'], // Ambassador approval skips 'approved' and goes straight to 'published'
    under_review: ['published', 'rejected', 'correction_requested'],
    correction_requested: [], // Wait for society
    correction_submitted: ['under_review', 'published', 'rejected', 'correction_requested'],
    approved: [], // Should not happen in standard flow for ambassador now
    published: [],
    rejected: [],
    archived: []
  },
  society_candidate: {
    draft: ['submitted'],
    submitted: [], // Waiting for review
    under_review: [], // Waiting for review
    correction_requested: ['correction_submitted'],
    correction_submitted: [],
    approved: [],
    published: [],
    rejected: [],
    archived: []
  },
  denied: {
    draft: [], submitted: [], under_review: [], correction_requested: [], correction_submitted: [], approved: [], published: [], rejected: [], archived: []
  }
};

/**
 * Validates if a state transition is allowed for a given role.
 */
export function validateTransition(currentStatus: OpportunityStatus, targetStatus: OpportunityStatus, role: string): boolean {
  // Map super_admin to admin, and society to society_candidate for permissions matrix
  const mappedRole = role === 'super_admin' ? 'admin' : (role === 'society' ? 'society_candidate' : role) as RoleCandidate;
  
  const roleTransitions = allowedTransitions[mappedRole];
  if (!roleTransitions) return false;

  const validNextStates = roleTransitions[currentStatus] || [];
  return validNextStates.includes(targetStatus);
}
