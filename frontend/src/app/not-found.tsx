"use client";

// ============================================================
// NotFound — 404 Page (FR-X4)
// ============================================================

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="container"
      style={{
        padding: "var(--space-24) 0",
        textAlign: "center",
        maxWidth: "500px",
      }}
    >
      <div
        style={{
          fontSize: "var(--text-4xl)",
          fontWeight: "var(--weight-bold)",
          color: "var(--color-text)",
          marginBottom: "var(--space-2)",
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)", margin: "0 0 var(--space-4) 0" }}>
        Page Not Found
      </h2>
      <p style={{ color: "var(--color-text-subtle)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-6) 0" }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary btn-md">
        Return to Home →
      </Link>
    </div>
  );
}
