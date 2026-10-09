"use client";

// ============================================================
// Career Questions Page (FR-C2) — Screen 8
// ============================================================

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { analyzeCareer } from "@/store/careerSlice";
import { QuestionStep } from "@/features/career/QuestionStep";
import { ErrorState } from "@/components/ui/ErrorState";

export default function CareerQuestionsPage() {
  const params = useParams();
  const profileId = (params?.profileId as string) || "";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { questions, step, loading, error } = useAppSelector((state) => state.career);

  useEffect(() => {
    if (step === "results") {
      router.push(`/career/${profileId}/results`);
    }
  }, [step, profileId, router]);

  const handleSubmitAnswers = (answers: Record<string, string | string[]>) => {
    dispatch(
      analyzeCareer({
        skills: [],
        answers,
      })
    );
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <h3>No questions pending</h3>
        <p style={{ color: "var(--color-text-subtle)", marginBottom: "var(--space-6)" }}>
          Your profile may already have enough details to generate recommendations.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => router.push(`/career/${profileId}/results`)}
        >
          View Recommendations →
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--space-12) 0 var(--space-20)" }}>
      <div className="container">
        {error && (
          <div style={{ maxWidth: "680px", margin: "0 auto var(--space-6)" }}>
            <ErrorState title="Error submitting answers" message={error} />
          </div>
        )}

        <QuestionStep
          questions={questions}
          onSubmitAnswers={handleSubmitAnswers}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
