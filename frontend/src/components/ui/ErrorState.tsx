"use client";

// ============================================================
// ErrorState — Friendly error display with retry action
// ============================================================

import React from "react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`alert alert-error ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "var(--space-3)",
      }}
    >
      <div>
        <h4 style={{ fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)" }}>
          {title}
        </h4>
        <p style={{ margin: 0, fontSize: "var(--text-sm)" }}>{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
