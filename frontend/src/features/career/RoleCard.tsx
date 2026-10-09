"use client";

// ============================================================
// RoleCard — Role match recommendation card (FR-C3, FR-C4)
// ============================================================

import React, { useState } from "react";
import type { RoleMatch } from "@/api/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface RoleCardProps {
  role: RoleMatch;
  onSelectRole: (roleId: string, dailyHours: number, deadline: string) => void;
  isLoading: boolean;
}

export function RoleCard({ role, onSelectRole, isLoading }: RoleCardProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [dailyHours, setDailyHours] = useState(2);

  // Default deadline: today + role.estimated_weeks weeks
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (role.estimated_weeks || 8) * 7);
  const defaultDeadline = targetDate.toISOString().split("T")[0];
  const [deadline, setDeadline] = useState(defaultDeadline);

  // Normalize fit score if 0-1 or 0-100
  const fitPercent = role.fit_score <= 1 ? Math.round(role.fit_score * 100) : Math.round(role.fit_score);

  const handleConfirmPlan = () => {
    onSelectRole(role.role_id, dailyHours, deadline);
  };

  return (
    <Card
      hover
      emphasis={fitPercent >= 80}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "var(--space-6)",
        padding: "var(--space-6)",
        background: "var(--color-bg)",
      }}
    >
      <div>
        {/* Header with fit score */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-3)" }}>
          <div>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: "var(--weight-bold)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-text-subtle)",
              }}
            >
              Recommended Pathway
            </span>
            <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", margin: "var(--space-1) 0 0" }}>
              {role.title}
            </h3>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: "var(--weight-bold)",
                color: fitPercent >= 80 ? "var(--color-text)" : "var(--color-text-subtle)",
              }}
            >
              {fitPercent}% Fit
            </div>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              ~{role.estimated_weeks} weeks
            </span>
          </div>
        </div>

        {/* Fit Reasoning */}
        {role.fit_reasons && role.fit_reasons.length > 0 && (
          <div style={{ marginTop: "var(--space-4)" }}>
            <h4 style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-subtle)", marginBottom: "var(--space-2)" }}>
              Why This Role Fits
            </h4>
            <ul style={{ margin: 0, paddingLeft: "var(--space-4)", fontSize: "var(--text-xs)", color: "var(--color-text)", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
              {role.fit_reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Skill Gaps */}
        {role.skill_gaps && role.skill_gaps.length > 0 && (
          <div style={{ marginTop: "var(--space-4)" }}>
            <h4 style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-subtle)", marginBottom: "var(--space-2)" }}>
              Skills to Acquire / Deepen ({role.skill_gaps.length})
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {role.skill_gaps.map((gap, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "var(--text-xs)",
                    padding: "3px var(--space-3)",
                    background: "var(--color-bg-subtle)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-text)",
                  }}
                >
                  <strong>{gap.skill}</strong>
                  <span style={{ color: "var(--color-text-muted)", marginLeft: "4px" }}>({gap.level_needed})</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Plan conversion */}
      <div>
        {showConfig ? (
          <div
            style={{
              padding: "var(--space-4)",
              background: "var(--color-bg-subtle)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              marginTop: "var(--space-2)",
            }}
          >
            <Input
              label="Target Finish Date"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <Input
              label="Daily Available Hours"
              type="number"
              step="0.5"
              min="0.5"
              max="12"
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value) || 2)}
            />
            <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-1)" }}>
              <Button variant="ghost" size="sm" onClick={() => setShowConfig(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                loading={isLoading}
                onClick={handleConfirmPlan}
              >
                Create Goal & Roadmap →
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            fullWidth
            onClick={() => setShowConfig(true)}
            disabled={isLoading}
          >
            Create Plan for this Role →
          </Button>
        )}
      </div>
    </Card>
  );
}
