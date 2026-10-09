"use client";

// ============================================================
// GoalForm — Creates a new goal with validation (FR-G1, FR-G2)
// ============================================================

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalFormSchema, type GoalFormData } from "@/lib/validation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ProgressMessages } from "@/components/ui/ProgressMessages";
import { ErrorState } from "@/components/ui/ErrorState";

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => void;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export function GoalForm({
  onSubmit,
  isLoading,
  error,
  onClearError,
}: GoalFormProps) {
  // Tomorrow's date formatted as YYYY-MM-DD for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    mode: "onChange",
    defaultValues: {
      goal_text: "",
      deadline: "",
      daily_hours: 2,
      language_hint: "en",
    },
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
        <ProgressMessages />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        maxWidth: "680px",
        margin: "0 auto",
      }}
      noValidate
    >
      {error && (
        <ErrorState
          title="Could not create plan"
          message={error}
          onRetry={onClearError}
          retryLabel="Dismiss"
        />
      )}

      <div>
        <Textarea
          id="goal-input"
          label="What is your goal?"
          placeholder="e.g. Build a production-ready Next.js SaaS app with payments and authentication, or Learn Urdu to conversational fluency..."
          hint="Supports any language. Write what you want to achieve in plain words."
          rows={4}
          error={errors.goal_text?.message}
          {...register("goal_text")}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <Input
            id="deadline-input"
            label="Target Deadline"
            type="date"
            min={minDate}
            error={errors.deadline?.message}
            {...register("deadline")}
          />
        </div>

        <div>
          <Input
            id="daily-hours-input"
            label="Daily Hours"
            type="number"
            step="0.5"
            min="0.5"
            max="12"
            hint="Between 0.5 and 12 hours"
            error={errors.daily_hours?.message}
            {...register("daily_hours", { valueAsNumber: true })}
          />
        </div>

        <div>
          <label htmlFor="language-select" className="label">
            Language <span className="label-optional">(optional)</span>
          </label>
          <select
            id="language-select"
            className="select"
            style={{ marginTop: "var(--space-2)" }}
            {...register("language_hint")}
          >
            <option value="en">English</option>
            <option value="ur">Urdu (اردو)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ar">Arabic (العربية)</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: "var(--space-4)" }}>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!isValid || isLoading}
        >
          Generate Execution Plan
        </Button>
      </div>
    </form>
  );
}
