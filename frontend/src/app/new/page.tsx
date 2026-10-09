"use client";

// ============================================================
// New Goal Page — Input and Clarification Flow (FR-G1 – FR-G5)
// ============================================================

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createGoal,
  answerClarifications,
  clearGoalCreation,
} from "@/store/goalsSlice";
import { GoalForm } from "@/features/goals/GoalForm";
import { ClarifyingQuestions } from "@/features/goals/ClarifyingQuestions";
import type { GoalFormData } from "@/lib/validation";

export default function NewGoalPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    creationStep,
    clarifyingQuestions,
    creationError,
    lastCreatedGoalId,
  } = useAppSelector((state) => state.goals);

  const isCreating = creationStep === "pending";

  // When goal is successfully created, navigate to dashboard
  useEffect(() => {
    if (lastCreatedGoalId) {
      router.push(`/goals/${lastCreatedGoalId}`);
    }
  }, [lastCreatedGoalId, router]);

  const handleFormSubmit = (data: GoalFormData) => {
    dispatch(
      createGoal({
        goal_text: data.goal_text,
        deadline: data.deadline,
        daily_hours: data.daily_hours,
        language_hint: data.language_hint,
      })
    );
  };

  const handleClarificationSubmit = (answers: Record<string, string>) => {
    dispatch(answerClarifications(answers));
  };

  const handleClearError = () => {
    dispatch(clearGoalCreation());
  };

  return (
    <div style={{ padding: "var(--space-12) 0 var(--space-20)" }}>
      <div className="container">
        {clarifyingQuestions && clarifyingQuestions.length > 0 ? (
          <ClarifyingQuestions
            questions={clarifyingQuestions}
            onSubmitAnswers={handleClarificationSubmit}
            isLoading={isCreating}
          />
        ) : (
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
              <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)", margin: "0 0 var(--space-2) 0" }}>
                Define Your Goal
              </h1>
              <p style={{ margin: 0, color: "var(--color-text-subtle)", fontSize: "var(--text-base)" }}>
                State your ambition clearly. FinishAI will calculate realistic daily milestones and build your roadmap.
              </p>
            </div>

            <GoalForm
              onSubmit={handleFormSubmit}
              isLoading={isCreating}
              error={creationError}
              onClearError={handleClearError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
