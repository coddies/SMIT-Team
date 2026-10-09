"use client";

// ============================================================
// Error — Global Error Boundary (FR-X3)
// ============================================================

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log without exposing sensitive data
    console.error("Runtime error caught by boundary:", error.message);
  }, [error]);

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
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--color-danger-bg)",
          color: "var(--color-danger)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto var(--space-4)",
          fontSize: "var(--text-xl)",
        }}
      >
        !
      </div>
      <h2 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-semibold)", margin: "0 0 var(--space-2) 0" }}>
        An unexpected error occurred
      </h2>
      <p style={{ color: "var(--color-text-subtle)", fontSize: "var(--text-sm)", margin: "0 0 var(--space-6) 0" }}>
        We encountered a temporary rendering problem. Your data has not been lost.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)" }}>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
        <Button variant="primary" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
