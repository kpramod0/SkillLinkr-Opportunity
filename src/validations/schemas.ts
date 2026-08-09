import { z } from 'zod';

// Common Schemas
export const emailSchema = z.string().email("Invalid email address").max(255);
export const phoneSchema = z.string().regex(/^\+?[0-9\s-]{10,15}$/, "Invalid phone number").optional().or(z.literal(''));
export const urlSchema = z.string().url("Invalid URL").max(500).optional().or(z.literal(''));

// Admin Onboarding Schema
export const adminOnboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
});

export const ambassadorOnboardingSchema = z.object({
  academic_year: z.string().min(1, "Academic year is required"),
  graduation_year: z.number().int().min(2020).max(2035),
  branch: z.string().min(2, "Branch is required").max(100),
  course: z.string().min(2, "Course is required").max(100),
  student_id: z.string().max(50).optional(),
  linkedin_url: urlSchema,
  photo_url: urlSchema,
  is_society_member: z.boolean().default(false),
  societies: z.array(z.object({
    society_name: z.string().max(100).optional().or(z.literal('')),
    society_role: z.string().max(100).optional().or(z.literal(''))
  })).optional()
}).refine(data => {
  if (data.is_society_member) {
    return data.societies && data.societies.length > 0 && data.societies.every(s => s.society_name && s.society_role);
  }
  return true;
}, {
  message: "Society name and role are required for each society if you are registering as a society member",
  path: ["societies"]
});

// Society Onboarding Schema
export const societyOnboardingSchema = z.object({
  representative_name: z.string().min(2, "Representative name is required").max(100),
  societies: z.array(z.object({
    society_name: z.string().max(100).optional().or(z.literal('')),
    position: z.string().max(100).optional().or(z.literal(''))
  })).optional(),
  contact_number: phoneSchema,
  photos: z.array(urlSchema).optional().default([]),
  linkedin_url: urlSchema,
  instagram_url: urlSchema,
  github_url: urlSchema,
  whatsapp_number: phoneSchema,
  year_of_studying: z.string().optional().or(z.literal('')),
  is_society_member: z.boolean().default(true)
}).refine(data => {
  if (data.is_society_member) {
    return data.societies && data.societies.length > 0 && data.societies.every(s => s.society_name && s.position);
  }
  return true;
}, {
  message: "Society name and role are required for each society if you are registering as a society member",
  path: ["societies"]
});
