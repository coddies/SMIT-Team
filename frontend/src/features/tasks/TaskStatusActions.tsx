"use client";

// ============================================================
// TaskStatusActions — Buttons to change task status (FR-T3)
// ============================================================

import React from "react";
import type { TaskStatus } from "@/api/types";
import { Button } from "@/components/ui/Button";

interface TaskStatusActionsProps {
  currentStatus: TaskStatus;
  onUpdateStatus: (status: TaskStatus) => void;
  isLoading?: boolean;
}

export function TaskStatusActions({
  currentStatus,
  onUpdateStatus,
  isLoading = false,
}: TaskStatusActionsProps) {
  return (
    <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
      <Button
        variant={currentStatus === "done" ? "primary" : "secondary"}
        size="sm"
        disabled={isLoading || currentStatus === "done"}
        onClick={() => onUpdateStatus("done")}
      >
        {currentStatus === "done" ? "✓ Done" : "Mark Done"}
      </Button>

      <Button
        variant={currentStatus === "missed" ? "danger" : "secondary"}
        size="sm"
        disabled={isLoading || currentStatus === "missed"}
        onClick={() => onUpdateStatus("missed")}
      >
        {currentStatus === "missed" ? "Missed" : "Mark Missed"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={isLoading || currentStatus === "skipped"}
        onClick={() => onUpdateStatus("skipped")}
      >
        {currentStatus === "skipped" ? "Skipped" : "Skip Task"}
      </Button>
    </div>
  );
}
