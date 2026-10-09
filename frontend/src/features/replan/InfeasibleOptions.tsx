"use client";

// ============================================================
// InfeasibleOptions — Clear choices when deadline is infeasible (FR-I1)
// ============================================================

import React from "react";
import type { ReplanOption } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface InfeasibleOptionsProps {
  explanation: string;
  options: ReplanOption[];
  onSelectOption: (option: ReplanOption) => void;
  isLoading: boolean;
}

const OPTION_DESCRIPTIONS: Record<ReplanOption, { title: string; desc: string }> = {
  extend_deadline: {
    title: "Extend Target Deadline",
    desc: "Keep all planned tasks and milestones, but push your deadline back to fit your daily schedule comfortably.",
  },
  cut_scope: {
    title: "Cut Scope / Deprioritize",
    desc: "Keep your current target deadline intact, but drop secondary tasks and focus strictly on the core MVP.",
  },
  increase_hours: {
    title: "Increase Daily Study / Work Hours",
    desc: "Dedicate more hours each day so you can finish the full scope before your current deadline.",
  },
};

export function InfeasibleOptions({
  explanation,
  options,
  onSelectOption,
  isLoading,
}: InfeasibleOptionsProps) {
  const displayOptions = options && options.length > 0 ? options : (["extend_deadline", "cut_scope", "increase_hours"] as ReplanOption[]);

  return (
    <Card
      style={{
        border: "2px solid var(--color-danger)",
        background: "var(--color-bg)",
        padding: "var(--space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            background: "var(--color-danger-bg)",
            color: "var(--color-danger)",
            padding: "var(--space-1) var(--space-3)",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-bold)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "var(--space-3)",
          }}
        >
          <span>⚠</span> Infeasible Deadline
        </div>

        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", margin: "0 0 var(--space-2) 0" }}>
          This deadline cannot be achieved with your current schedule
        </h2>

        <p style={{ margin: 0, fontSize: "var(--text-base)", color: "var(--color-text-subtle)", lineHeight: "var(--leading-relaxed)" }}>
          {explanation ||
            "Based on the remaining tasks, required hours, and missed milestones, there is not enough available daily time to finish before the deadline."}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <h4 style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em", margin: 0 }}>
          Choose how you would like to resolve this:
        </h4>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
          {displayOptions.map((opt) => {
            const config = OPTION_DESCRIPTIONS[opt] || { title: opt, desc: "Apply this option" };

            return (
              <Card
                key={opt}
                hover
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "var(--space-5)",
                  background: "var(--color-bg-subtle)",
                }}
              >
                <div>
                  <h5 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", margin: "0 0 var(--space-2) 0" }}>
                    {config.title}
                  </h5>
                  <p style={{ margin: 0, fontSize: "var(--text-xs)", color: "var(--color-text-subtle)", lineHeight: "var(--leading-relaxed)" }}>
                    {config.desc}
                  </p>
                </div>

                <div style={{ marginTop: "var(--space-5)" }}>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={() => onSelectOption(opt)}
                  >
                    Select Option
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
