"use client";

// ============================================================
// ReplanPage — Review re-plan proposal or handle infeasibility (FR-R1 – FR-R4, FR-I1)
// ============================================================

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  requestReplan,
  acceptReplan,
  rejectReplan,
  fetchGoal,
} from "@/store/goalsSlice";
import { DiffView } from "@/features/replan/DiffView";
import { InfeasibleOptions } from "@/features/replan/InfeasibleOptions";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProgressMessages } from "@/components/ui/ProgressMessages";
import type { ReplanOption } from "@/api/types";

export default function ReplanPage() {
  const params = useParams();
  const goalId = (params?.goalId as string) || "";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    replanProposal,
    replanLoading,
    replanError,
  } = useAppSelector((state) => state.goals);

  // Request initial replan on mount
  useEffect(() => {
    if (goalId && !replanProposal && !replanLoading) {
      dispatch(requestReplan({ goalId }));
    }
  }, [goalId, replanProposal, replanLoading, dispatch]);

  const handleSelectOption = (option: ReplanOption) => {
    dispatch(requestReplan({ goalId, option }));
  };

  const handleAccept = async () => {
    if (!replanProposal) return;
    await dispatch(
      acceptReplan({ goalId, proposalId: replanProposal.proposal_id })
    );
    await dispatch(fetchGoal(goalId));
    router.push(`/goals/${goalId}`);
  };

  const handleReject = async () => {
    if (!replanProposal) return;
    await dispatch(
      rejectReplan({ goalId, proposalId: replanProposal.proposal_id })
    );
    router.push(`/goals/${goalId}`);
  };

  if (replanLoading) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <ProgressMessages />
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--space-8) 0 var(--space-20)" }}>
      <div className="container" style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {/* Back Link */}
        <div>
          <Link
            href={`/goals/${goalId}`}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-subtle)",
              textDecoration: "none",
            }}
          >
            ← Back to Plan Dashboard
          </Link>
        </div>

        {replanError && (
          <ErrorState
            title="Failed to generate re-plan"
            message={replanError}
            onRetry={() => dispatch(requestReplan({ goalId }))}
          />
        )}

        {/* If Infeasible (FR-R4, FR-I1) */}
        {replanProposal && !replanProposal.feasible && (
          <InfeasibleOptions
            explanation={replanProposal.explanation}
            options={replanProposal.options || []}
            onSelectOption={handleSelectOption}
            isLoading={replanLoading}
          />
        )}

        {/* If Feasible proposal (FR-R2, FR-R3) */}
        {replanProposal && replanProposal.feasible && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
            <div>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-bold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-subtle)",
                }}
              >
                Re-plan Proposal
              </span>
              <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", margin: "var(--space-1) 0 0" }}>
                Proposed Schedule Adjustments
              </h1>
              <p style={{ margin: "var(--space-2) 0 0", color: "var(--color-text-subtle)", fontSize: "var(--text-sm)" }}>
                Review the changes made to keep your target achievable. You can accept this revised plan or reject it to keep your previous schedule.
              </p>
            </div>

            <DiffView
              diff={replanProposal.diff}
              explanation={replanProposal.explanation}
            />

            {/* Actions: Accept or Reject */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--space-3)",
                borderTop: "1px solid var(--color-border)",
                paddingTop: "var(--space-6)",
              }}
            >
              <Button variant="ghost" onClick={handleReject} disabled={replanLoading}>
                Reject & Keep Current Plan
              </Button>
              <Button variant="primary" onClick={handleAccept} loading={replanLoading}>
                Accept New Plan →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
