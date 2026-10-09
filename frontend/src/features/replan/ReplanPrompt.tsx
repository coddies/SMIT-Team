"use client";

// ============================================================
// ReplanPrompt — Alert when tasks are missed or re-plan suggested (FR-D3, FR-T4)
// ============================================================

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ReplanPromptProps {
  goalId: string;
  missedCount: number;
}

export function ReplanPrompt({ goalId, missedCount }: ReplanPromptProps) {
  if (missedCount <= 0) return null;

  return (
    <div
      className="alert alert-warning"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "var(--space-4)",
        flexWrap: "wrap",
      }}
    >
      <div>
        <h4 style={{ margin: "0 0 var(--space-1) 0", fontWeight: "var(--weight-semibold)" }}>
          Schedule Adjustment Recommended
        </h4>
        <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>
          You have {missedCount} {missedCount === 1 ? "missed task" : "missed tasks"}. FinishAI can intelligently reschedule your roadmap so you stay on track.
        </p>
      </div>

      <Link href={`/goals/${goalId}/replan`} className="btn btn-primary btn-sm">
        Review Re-plan →
      </Link>
    </div>
  );
}
