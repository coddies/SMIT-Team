"use client";

// ============================================================
// Spinner — loading indicator
// ============================================================

import styles from "./Spinner.module.css";

type Props = {
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
  label?: string;
};

export function Spinner({ size = "md", inverse = false, label = "Loading..." }: Props) {
  const cls = [
    "spinner",
    size === "sm" ? "spinner-sm" : "",
    size === "lg" ? "spinner-lg" : "",
    inverse ? "spinner-inverse" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span role="status" aria-label={label}>
      <span className={cls} aria-hidden="true" />
      <span className="visually-hidden">{label}</span>
    </span>
  );
}
