// ============================================================
// Zod form schemas — shared with type definitions
// ============================================================

import { z } from "zod";

// Goal Input form
export const goalFormSchema = z.object({
  goal_text: z
    .string()
    .min(10, "Goal must be at least 10 characters")
    .max(1000, "Goal must be under 1000 characters"),
  deadline: z
    .string()
    .min(1, "Please select a deadline")
    .refine((val) => {
      const d = new Date(val);
      return !isNaN(d.getTime()) && d > new Date();
    }, "Deadline must be a future date"),
  daily_hours: z
    .number()
    .min(0.5, "Minimum 0.5 hours per day")
    .max(12, "Maximum 12 hours per day"),
  language_hint: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
export type GoalFormData = GoalFormValues;

// Career skills form
export const skillLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const skillItemSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: skillLevelSchema,
});

export const careerSkillsFormSchema = z.object({
  skills: z
    .array(skillItemSchema)
    .min(1, "Add at least one skill"),
  background: z.string().optional(),
  interests: z.string().optional(),
});

export type CareerSkillsFormValues = z.infer<typeof careerSkillsFormSchema>;

// Select role form
export const selectRoleFormSchema = z.object({
  role_id: z.string().min(1),
  daily_hours: z
    .number()
    .min(0.5, "Minimum 0.5 hours per day")
    .max(12, "Maximum 12 hours per day"),
  deadline: z
    .string()
    .min(1, "Please select a deadline")
    .refine((val) => new Date(val) > new Date(), "Deadline must be future"),
});

export type SelectRoleFormValues = z.infer<typeof selectRoleFormSchema>;
