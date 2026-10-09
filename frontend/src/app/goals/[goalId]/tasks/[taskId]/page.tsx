"use client";

// ============================================================
// Task Detail Page — Complete Task View (FR-T1 – FR-T4)
// ============================================================

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGoal } from "@/store/goalsSlice";
import { setTaskStatus } from "@/store/tasksSlice";
import { TaskStatusActions } from "@/features/tasks/TaskStatusActions";
import { ResourceList } from "@/features/tasks/ResourceList";
import { ReplanPrompt } from "@/features/replan/ReplanPrompt";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/dates";

export default function TaskDetailPage() {
  const params = useParams();
  const goalId = (params?.goalId as string) || "";
  const taskId = (params?.taskId as string) || "";

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { activeGoal, goalLoading } = useAppSelector((state) => state.goals);
  const { updatingIds, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    if (!activeGoal && goalId) {
      dispatch(fetchGoal(goalId));
    }
  }, [goalId, activeGoal, dispatch]);

  const task =
    activeGoal?.tasks_today.find((t) => t.id === taskId) ??
    activeGoal?.milestones.flatMap((m) => m.tasks).find((t) => t.id === taskId);

  const milestone = activeGoal?.milestones.find((m) => m.id === task?.milestone_id);

  const handleUpdateStatus = (status: import("@/api/types").TaskStatus) => {
    dispatch(setTaskStatus({ taskId, status, goalId }));
  };

  const isUpdating = updatingIds.includes(taskId);

  if (goalLoading && !activeGoal) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <div className="spinner spinner-lg" style={{ margin: "0 auto var(--space-4)" }} />
        <p style={{ color: "var(--color-text-subtle)" }}>Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container" style={{ padding: "var(--space-16) 0", textAlign: "center" }}>
        <h3>Task not found</h3>
        <p style={{ color: "var(--color-text-subtle)", marginBottom: "var(--space-6)" }}>
          The requested task could not be located in this goal.
        </p>
        <Link href={`/goals/${goalId}`} className="btn btn-primary btn-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "var(--space-8) 0 var(--space-20)" }}>
      <div className="container" style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            href={`/goals/${goalId}`}
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--color-text-subtle)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-1)",
            }}
          >
            ← Back to Plan Dashboard
          </Link>
        </div>

        {/* Re-plan notification if needed */}
        {activeGoal?.replan_suggested && (
          <ReplanPrompt goalId={goalId} missedCount={activeGoal.missed_tasks_count} />
        )}

        {error && (
          <div className="alert alert-error">
            Failed to update task status: {error}
          </div>
        )}

        {/* Main Task Card */}
        <Card style={{ padding: "var(--space-8)", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-4)", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                <Badge status={task.status} />
                {milestone && (
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-subtle)" }}>
                    Milestone: <strong>{milestone.title}</strong>
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", margin: 0, lineHeight: 1.3 }}>
                {task.title}
              </h1>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                Scheduled Date
              </div>
              <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>
                {formatDate(task.scheduled_date)}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-1)" }}>
                {task.estimated_hours}h estimated
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <h4 style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-subtle)", marginBottom: "var(--space-2)" }}>
                Task Overview
              </h4>
              <p style={{ margin: 0, fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)", color: "var(--color-text)" }}>
                {task.description}
              </p>
            </div>
          )}

          {/* Status Actions (FR-T3) */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-5)" }}>
            <h4 style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-subtle)", marginBottom: "var(--space-3)" }}>
              Update Execution Status
            </h4>
            <TaskStatusActions
              currentStatus={task.status}
              onUpdateStatus={handleUpdateStatus}
              isLoading={isUpdating}
            />
          </div>

          {/* Resources (FR-T2) */}
          <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-5)" }}>
            <h4 style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-subtle)", marginBottom: "var(--space-3)" }}>
              Curated Free Resources & Guides
            </h4>
            <ResourceList resources={task.resources} />
          </div>
        </Card>
      </div>
    </div>
  );
}
