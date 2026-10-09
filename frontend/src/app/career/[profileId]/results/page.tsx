"use client";

// ============================================================
// Career Results Page (FR-C3, FR-C4) — Screen 9
// ============================================================

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCareerRole } from "@/store/careerSlice";
import { RoleCard } from "@/features/career/RoleCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProgressMessages } from "@/components/ui/ProgressMessages";

export default function CareerResultsPage() {
  const params = useParams();
  const profileId = (params?.profileId as string) || "";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { roles, loading, error, selectedRoleGoalId } = useAppSelector(
    (state) => state.career
  );

  useEffect(() => {
    if (selectedRoleGoalId) {
      router.push(`/goals/${selectedRoleGoalId}`);
    }
  }, [selectedRoleGoalId, router]);

  const handleSelectRole = (
    roleId: string,
    dailyHours: number,
    deadline: string
  ) => {
    dispatch(
      selectCareerRole({
        profileId,
        input: {
          role_id: roleId,
          daily_hours: dailyHours,
          deadline,
        },
      })
    );
  };

  if (loading && (!roles || roles.length === 0)) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <ProgressMessages />
      </div>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <h3>No role recommendations found</h3>
        <p style={{ color: "var(--color-text-subtle)", marginBottom: "var(--space-6)" }}>
          Please try refining your technical skills and experience details.
        </p>
        <Link href="/career" className="btn btn-primary btn-sm">
          Return to Skills Input
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--space-12) 0 var(--space-20)" }}>
      <div className="container">
        <div style={{ maxWidth: "880px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
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
              Tailored Career Options
            </span>
            <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)", margin: "var(--space-1) 0 0" }}>
              Target Role Matches
            </h1>
            <p style={{ margin: "var(--space-2) 0 0", color: "var(--color-text-subtle)", fontSize: "var(--text-base)" }}>
              Based on your skill profile, we evaluated your fit score and identified the exact skills you need to build next.
            </p>
          </div>

          {error && (
            <ErrorState title="Error creating plan" message={error} />
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-6)",
              alignItems: "stretch",
            }}
          >
            {roles.slice(0, 3).map((role) => (
              <RoleCard
                key={role.role_id}
                role={role}
                onSelectRole={handleSelectRole}
                isLoading={loading}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
