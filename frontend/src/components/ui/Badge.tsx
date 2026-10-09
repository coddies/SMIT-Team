"use client";

// ============================================================
// Badge — Status and categorical label
// ============================================================

import React from "react";
import type { TaskStatus } from "@/api/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "done" | "missed" | "skipped" | "pending";
  status?: TaskStatus;
}

export function Badge({
  variant,
  status,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const resolvedVariant = status || variant || "default";
  const classes = ["badge", `badge-${resolvedVariant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} {...props}>
      {children || resolvedVariant}
    </span>
  );
}
