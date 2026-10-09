"use client";

// ============================================================
// TaskCard — Individual task item card
// ============================================================

import React from "react";
import Link from "next/link";
import type { Task } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/dates";

interface TaskCardProps {
  task: Task;
  goalId: string;
  milestoneTitle?: string;
  onStatusChange?: (status: Task["status"]) => void;
  isStatusLoading?: boolean;
}

export function TaskCard({
  task,
  goalId,
  milestoneTitle,
  onStatusChange,
  isStatusLoading = false,
}: TaskCardProps) {
  const isDone = task.status === "done";
  const isMissed = task.status === "missed";

  return (
    <Card
      hover
      style={{
        padding: "var(--space-4) var(--space-5)",
        opacity: isDone ? 0.75 : 1,
        borderColor: isMissed ? "rgba(192,57,43,0.3)" : undefined,
        background: isMissed ? "var(--color-danger-bg)" : "var(--color-bg)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
            <Badge status={task.status} />
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              {task.estimated_hours}h
            </span>
            {milestoneTitle && (
              <>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>•</span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-subtle)", fontWeight: "var(--weight-medium)" }}>
                  {milestoneTitle}
                </span>
              </>
            )}
          </div>

          <Link
            href={`/goals/${goalId}/tasks/${task.id}`}
            style={{
              textDecoration: "none",
              color: "var(--color-text)",
            }}
          >
            <h4
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--weight-medium)",
                margin: 0,
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {task.title}
            </h4>
          </Link>

          {task.description && (
            <p
              style={{
                margin: "var(--space-1) 0 0",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-subtle)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {task.description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-2)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
            {formatDate(task.scheduled_date)}
          </span>

          <div style={{ display: "flex", gap: "var(--space-1)" }}>
            {task.status !== "done" && onStatusChange && (
              <button
                type="button"
                onClick={() => onStatusChange("done")}
                disabled={isStatusLoading}
                className="btn btn-secondary btn-sm"
                style={{ padding: "2px 8px", fontSize: "11px" }}
                title="Mark Done"
              >
                ✓ Done
              </button>
            )}
            <Link
              href={`/goals/${goalId}/tasks/${task.id}`}
              className="btn btn-ghost btn-sm"
              style={{ padding: "2px 8px", fontSize: "11px" }}
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
