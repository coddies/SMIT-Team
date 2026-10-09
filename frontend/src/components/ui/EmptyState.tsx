"use client";

// ============================================================
// EmptyState — Display when list or section has no items
// ============================================================

import React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        textAlign: "center",
        padding: "var(--space-12) var(--space-6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-3)",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-full)",
          background: "var(--color-bg-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-subtle)",
          fontSize: "var(--text-xl)",
          marginBottom: "var(--space-2)",
        }}
      >
        —
      </div>
      <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", margin: 0 }}>
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-subtle)",
            maxWidth: "400px",
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} style={{ marginTop: "var(--space-2)" }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
