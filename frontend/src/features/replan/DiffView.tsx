"use client";

// ============================================================
// DiffView — Visual breakdown of re-plan changes (FR-R2)
// ============================================================

import React from "react";
import type { ReplanTaskDiff } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/dates";

interface DiffViewProps {
  diff: ReplanTaskDiff[];
  explanation: string;
}

export function DiffView({ diff, explanation }: DiffViewProps) {
  const movedTasks = diff.filter((d) => d.change === "moved");
  const removedTasks = diff.filter((d) => d.change === "removed");
  const addedTasks = diff.filter((d) => d.change === "added");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* AI Explanation banner */}
      <Card
        emphasis
        style={{
          background: "var(--color-bg-subtle)",
          padding: "var(--space-5)",
          borderLeft: "4px solid var(--color-text)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-bold)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-subtle)",
          }}
        >
          AI Rationale
        </span>
        <p style={{ margin: "var(--space-2) 0 0", fontSize: "var(--text-base)", lineHeight: "var(--leading-relaxed)" }}>
          {explanation}
        </p>
      </Card>

      {/* Moved Tasks */}
      {movedTasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-warning)",
              }}
            />
            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Rescheduled Tasks ({movedTasks.length})
            </h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {movedTasks.map((t) => (
              <div
                key={t.task_id}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span style={{ fontWeight: "var(--weight-medium)", fontSize: "var(--text-sm)" }}>
                  {t.task_title}
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-subtle)", whiteSpace: "nowrap" }}>
                  <span style={{ textDecoration: "line-through", color: "var(--color-text-muted)" }}>
                    {t.old_date ? formatDate(t.old_date) : "Earlier"}
                  </span>
                  {" → "}
                  <strong style={{ color: "var(--color-text)" }}>
                    {t.new_date ? formatDate(t.new_date) : "New date"}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Added Tasks */}
      {addedTasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-success)",
              }}
            />
            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Added Buffer / Catch-up Tasks ({addedTasks.length})
            </h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {addedTasks.map((t) => (
              <div
                key={t.task_id}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-success-bg)",
                  border: "1px solid rgba(26,122,74,0.2)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span style={{ fontWeight: "var(--weight-medium)", fontSize: "var(--text-sm)", color: "var(--color-success)" }}>
                  + {t.task_title}
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success)" }}>
                  {t.new_date ? formatDate(t.new_date) : "Scheduled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Removed Tasks */}
      {removedTasks.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-danger)",
              }}
            />
            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Deprioritized / Removed Tasks ({removedTasks.length})
            </h4>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
            {removedTasks.map((t) => (
              <div
                key={t.task_id}
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "var(--color-danger-bg)",
                  border: "1px solid rgba(192,57,43,0.2)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "var(--space-3)",
                }}
              >
                <span style={{ fontWeight: "var(--weight-medium)", fontSize: "var(--text-sm)", color: "var(--color-danger)", textDecoration: "line-through" }}>
                  - {t.task_title}
                </span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-danger)" }}>
                  Removed from scope
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
