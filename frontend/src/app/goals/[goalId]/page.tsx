"use client";

// ============================================================
// Goal Dashboard Page — Main execution cockpit (FR-D1 – FR-D5)
// ============================================================

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGoal, fetchNextAction } from "@/store/goalsSlice";
import { setTaskStatus } from "@/store/tasksSlice";
import { NextBestActionPanel } from "@/features/nba/NextBestActionPanel";
import { ReplanPrompt } from "@/features/replan/ReplanPrompt";
import { MilestoneList } from "@/features/goals/MilestoneList";
import { TaskList } from "@/features/tasks/TaskList";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ErrorState } from "@/components/ui/ErrorState";
import { daysRemaining, formatDate } from "@/lib/dates";

export default function GoalDashboardPage() {
  const params = useParams();
  const goalId = (params?.goalId as string) || "";

  const dispatch = useAppDispatch();
  const {
    activeGoal,
    goalLoading,
    goalError,
    nextAction,
    nextActionLoading,
  } = useAppSelector((state) => state.goals);

  const { updatingIds } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    if (goalId) {
      dispatch(fetchGoal(goalId));
      dispatch(fetchNextAction(goalId));
    }
  }, [goalId, dispatch]);

  const handleUpdateStatus = (taskId: string, status: import("@/api/types").TaskStatus) => {
    dispatch(setTaskStatus({ taskId, status, goalId }));
  };

  if (goalLoading && !activeGoal) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <div className="spinner spinner-lg" style={{ margin: "0 auto var(--space-4)" }} />
        <p style={{ color: "var(--color-text-subtle)", fontSize: "var(--text-base)" }}>
          Loading your execution plan...
        </p>
      </div>
    );
  }

  if (goalError) {
    return (
      <div className="container" style={{ padding: "var(--space-12) 0", maxWidth: "600px" }}>
        <ErrorState
          title="Could not load goal"
          message={goalError}
          onRetry={() => {
            dispatch(fetchGoal(goalId));
            dispatch(fetchNextAction(goalId));
          }}
        />
      </div>
    );
  }

  if (!activeGoal) {
    return null;
  }

  const daysLeft = daysRemaining(activeGoal.deadline);

  // Collect all tasks across milestones
  const allTasks = activeGoal.milestones.flatMap((m) => m.tasks);

  return (
    <div style={{ padding: "var(--space-8) 0 var(--space-20)" }}>
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        {/* Re-plan Prompt (FR-D3, FR-T4) */}
        {(activeGoal.missed_tasks_count > 0 || activeGoal.replan_suggested) && (
          <ReplanPrompt goalId={goalId} missedCount={activeGoal.missed_tasks_count} />
        )}

        {/* Goal Header & Stats (FR-D1) */}
        <div
          style={{
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "0" }}>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-bold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-subtle)",
                }}
              >
                Active Goal
              </span>
              <h1
                className="goal-title"
                dir="auto"
                style={{
                  fontSize: "var(--text-3xl)",
                  fontWeight: "var(--weight-bold)",
                  margin: "var(--space-1) 0 0",
                  lineHeight: 1.2,
                }}
              >
                {activeGoal.goal_text}
              </h1>
            </div>

            <div className="goal-stats-row" style={{ display: "flex", gap: "var(--space-4)", alignItems: "center", flexWrap: "wrap" }}>
              <div
                className="goal-stat-box"
                style={{
                  textAlign: "right",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Deadline: {formatDate(activeGoal.deadline)}
                </div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>
                  {daysLeft >= 0 ? `${daysLeft} days remaining` : `${Math.abs(daysLeft)} days overdue`}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-bg-subtle)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                  Commitment
                </div>
                <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)", color: "var(--color-text)" }}>
                  {activeGoal.daily_hours}h / day
                </div>
              </div>
            </div>
          </div>

          <ProgressBar
            progress={activeGoal.progress_percent}
            label="Overall Plan Progress"
          />
        </div>

        {/* Next Best Action Panel (FR-D2) */}
        <div>
          <NextBestActionPanel
            goalId={goalId}
            nextAction={nextAction}
            isLoading={nextActionLoading}
            onMarkDone={(taskId) => handleUpdateStatus(taskId, "done")}
            isUpdatingStatus={updatingIds.length > 0}
          />
        </div>

        {/* Main 2-Column Execution Grid */}
        <div
          className="goal-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "var(--space-8)",
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Tasks Schedule (Today & All) */}
          <div style={{ flex: 1.4 }}>
            <TaskList
              tasks={allTasks}
              milestones={activeGoal.milestones}
              goalId={goalId}
              onUpdateTaskStatus={handleUpdateStatus}
              statusLoadingTaskId={updatingIds[0] || null}
            />
          </div>

          {/* Right Column: Milestones Roadmap */}
          <div style={{ flex: 1 }}>
            <MilestoneList milestones={activeGoal.milestones} />
          </div>
        </div>
      </div>
    </div>
  );
}
