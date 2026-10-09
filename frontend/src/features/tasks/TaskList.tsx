"use client";

// ============================================================
// TaskList — Grouped tasks by date with empty state (FR-D4, FR-D5)
// ============================================================

import React, { useState } from "react";
import type { Task, Milestone } from "@/api/types";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/dates";

interface TaskListProps {
  tasks: Task[];
  milestones: Milestone[];
  goalId: string;
  onUpdateTaskStatus?: (taskId: string, status: Task["status"]) => void;
  statusLoadingTaskId?: string | null;
}

export function TaskList({
  tasks,
  milestones,
  goalId,
  onUpdateTaskStatus,
  statusLoadingTaskId,
}: TaskListProps) {
  const [filter, setFilter] = useState<"today" | "all">("today");

  // Determine today's date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0];

  // Map milestone id to title
  const milestoneMap = new Map<string, string>();
  milestones.forEach((m) => {
    milestoneMap.set(m.id, m.title);
  });

  const todayTasks = tasks.filter((t) => t.scheduled_date === todayStr);

  // Group all tasks by scheduled date
  const groupedTasks: Record<string, Task[]> = {};
  tasks.forEach((t) => {
    if (!groupedTasks[t.scheduled_date]) {
      groupedTasks[t.scheduled_date] = [];
    }
    groupedTasks[t.scheduled_date].push(t);
  });

  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
        <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", margin: 0 }}>
          Tasks Schedule
        </h3>

        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            type="button"
            className={`btn btn-sm ${filter === "today" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("today")}
          >
            Today ({todayTasks.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("all")}
          >
            All Plan ({tasks.length})
          </button>
        </div>
      </div>

      {filter === "today" ? (
        todayTasks.length === 0 ? (
          <EmptyState
            title="No tasks scheduled for today"
            description="You have completed all actions for today or no tasks were placed on this date."
            actionLabel="View all upcoming tasks"
            onAction={() => setFilter("all")}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                goalId={goalId}
                milestoneTitle={milestoneMap.get(task.milestone_id)}
                onStatusChange={onUpdateTaskStatus ? (s) => onUpdateTaskStatus(task.id, s) : undefined}
                isStatusLoading={statusLoadingTaskId === task.id}
              />
            ))}
          </div>
        )
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {sortedDates.map((dateStr) => {
            const dateTasks = groupedTasks[dateStr];
            const isToday = dateStr === todayStr;

            return (
              <div key={dateStr} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--weight-bold)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: isToday ? "var(--color-text)" : "var(--color-text-subtle)",
                    }}
                  >
                    {isToday ? `Today (${formatDate(dateStr)})` : formatDate(dateStr)}
                  </span>
                  <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  {dateTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      goalId={goalId}
                      milestoneTitle={milestoneMap.get(task.milestone_id)}
                      onStatusChange={onUpdateTaskStatus ? (s) => onUpdateTaskStatus(task.id, s) : undefined}
                      isStatusLoading={statusLoadingTaskId === task.id}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
