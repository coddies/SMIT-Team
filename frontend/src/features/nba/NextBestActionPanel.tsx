"use client";

// ============================================================
// NextBestActionPanel — Always visible action panel (FR-D2)
// ============================================================

import React from "react";
import Link from "next/link";
import type { NextAction } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface NextBestActionPanelProps {
  goalId: string;
  nextAction: NextAction | null;
  isLoading: boolean;
  onMarkDone?: (taskId: string) => void;
  isUpdatingStatus?: boolean;
}

export function NextBestActionPanel({
  goalId,
  nextAction,
  isLoading,
  onMarkDone,
  isUpdatingStatus,
}: NextBestActionPanelProps) {
  if (isLoading) {
    return (
      <Card
        emphasis
        style={{
          background: "var(--color-bg)",
          padding: "var(--space-5)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-3)",
        }}
      >
        <div className="spinner spinner-sm" />
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-subtle)" }}>
          Determining next best action...
        </span>
      </Card>
    );
  }

  if (!nextAction) {
    return (
      <Card
        style={{
          background: "var(--color-bg-subtle)",
          padding: "var(--space-5)",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-subtle)", fontWeight: "var(--weight-medium)" }}>
          All caught up! No pending tasks remaining for today.
        </span>
      </Card>
    );
  }

  return (
    <Card
      emphasis
      style={{
        background: "var(--color-bg)",
        border: "2px solid var(--color-text)",
        padding: "var(--space-5)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-1)" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--color-text)",
              }}
            />
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text)",
              }}
            >
              Next Best Action
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>•</span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-subtle)", fontWeight: "var(--weight-medium)" }}>
              {nextAction.estimated_hours}h estimated
            </span>
          </div>

          <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", margin: "var(--space-1) 0" }}>
            {nextAction.task_title}
          </h3>

          {nextAction.milestone_title && (
            <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-subtle)" }}>
              Milestone: <strong>{nextAction.milestone_title}</strong>
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          {onMarkDone && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onMarkDone(nextAction.task_id)}
              disabled={isUpdatingStatus}
            >
              Mark Done
            </Button>
          )}
          <Link
            href={`/goals/${goalId}/tasks/${nextAction.task_id}`}
            className="btn btn-primary btn-sm"
          >
            Open Task →
          </Link>
        </div>
      </div>
    </Card>
  );
}
