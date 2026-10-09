"use client";

// ============================================================
// ResourceList — Curated resources with safe URL links (FR-T2)
// ============================================================

import React from "react";
import type { Resource } from "@/api/types";
import { isSafeUrl } from "@/lib/safeUrl";

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return (
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0 }}>
        No external resources attached to this task.
      </p>
    );
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {resources.map((res, index) => {
        const hasSafeUrl = isSafeUrl(res.url);

        return (
          <li
            key={index}
            style={{
              padding: "var(--space-3) var(--space-4)",
              background: "var(--color-bg-subtle)",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--space-3)",
            }}
          >
            <div>
              <div style={{ fontWeight: "var(--weight-medium)", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
                {res.title}
              </div>
            </div>

            {hasSafeUrl ? (
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ textDecoration: "none" }}
              >
                Open Resource ↗
              </a>
            ) : (
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                {res.url}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
