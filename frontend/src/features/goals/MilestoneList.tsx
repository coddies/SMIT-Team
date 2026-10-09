"use client";

// ============================================================
// MilestoneList — Displays the ordered milestones and progress
// ============================================================

import React from "react";
import type { Milestone } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/dates";

interface MilestoneListProps {
  milestones: Milestone[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  if (!milestones || milestones.length === 0) {
    return null;
  }

  // Sort milestones by due date
  const sorted = [...milestones].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", margin: 0 }}>
        Milestones Roadmap
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        {milestones.map((m, idx) => {
          const completedCount = m.tasks.filter((t) => t.status === "done").length;
          const totalCount = m.tasks.length;
          const isDone = totalCount > 0 && completedCount === totalCount;

          return (
            <Card
              key={m.id}
              style={{
                padding: "var(--space-4) var(--space-5)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                borderLeft: isDone ? "4px solid var(--color-success)" : "4px solid var(--color-border-strong)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <span
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "var(--weight-bold)",
                      color: "var(--color-text-subtle)",
                      width: "24px",
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <h4 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-medium)", margin: 0 }}>
                    {m.title}
                  </h4>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                    Due: {formatDate(m.due_date)}
                  </span>
                  <Badge variant={isDone ? "done" : "default"}>
                    {completedCount} / {totalCount} tasks
                  </Badge>
                </div>
              </div>

              {m.description && (
                <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-subtle)", paddingLeft: "36px" }}>
                  {m.description}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
