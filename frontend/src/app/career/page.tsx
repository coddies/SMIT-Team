"use client";

// ============================================================
// Career Skills Page (FR-C1) — Screen 7
// ============================================================

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { analyzeCareer, resetCareer } from "@/store/careerSlice";
import { SkillInput } from "@/features/career/SkillInput";
import { ErrorState } from "@/components/ui/ErrorState";

export default function CareerSkillsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { profileId, step, loading, error } = useAppSelector((state) => state.career);

  useEffect(() => {
    if (profileId) {
      if (step === "questions") {
        router.push(`/career/${profileId}/questions`);
      } else if (step === "results") {
        router.push(`/career/${profileId}/results`);
      }
    }
  }, [profileId, step, router]);

  const handleSubmit = (data: {
    skills: import("@/api/types").Skill[];
    background?: string;
    interests?: string;
  }) => {
    dispatch(analyzeCareer(data));
  };

  return (
    <div style={{ padding: "var(--space-12) 0 var(--space-20)" }}>
      <div className="container">
        {error && (
          <div style={{ maxWidth: "680px", margin: "0 auto var(--space-6)" }}>
            <ErrorState
              title="Career Analysis Failed"
              message={error}
              onRetry={() => dispatch(resetCareer())}
              retryLabel="Start Over"
            />
          </div>
        )}

        <SkillInput onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}
