"use client";

// ============================================================
// QuestionStep — Career follow-up questions (FR-C2)
// ============================================================

import React, { useState } from "react";
import type { CareerQuestion } from "@/api/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressMessages } from "@/components/ui/ProgressMessages";

interface QuestionStepProps {
  questions: CareerQuestion[];
  onSubmitAnswers: (answers: Record<string, string | string[]>) => void;
  isLoading: boolean;
}

export function QuestionStep({
  questions,
  onSubmitAnswers,
  isLoading,
}: QuestionStepProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleSingleSelect = (qid: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleMultiSelect = (qid: string, val: string) => {
    const current = (answers[qid] as string[]) || [];
    if (current.includes(val)) {
      setAnswers((prev) => ({ ...prev, [qid]: current.filter((x) => x !== val) }));
    } else {
      setAnswers((prev) => ({ ...prev, [qid]: [...current, val] }));
    }
  };

  const handleTextChange = (qid: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnswers(answers);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-12) 0" }}>
        <ProgressMessages />
      </div>
    );
  }

  return (
    <Card style={{ maxWidth: "680px", margin: "0 auto", padding: "var(--space-8)" }}>
      <div style={{ marginBottom: "var(--space-6)" }}>
        <span
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--color-text-subtle)",
          }}
        >
          Refining Analysis
        </span>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", marginTop: "var(--space-1)" }}>
          A few targeted career questions
        </h2>
        <p style={{ color: "var(--color-text-subtle)", fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>
          These questions calibrate your target seniority and specialization preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {questions.map((q, idx) => (
          <div
            key={q.id}
            style={{
              padding: "var(--space-5)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-subtle)",
            }}
          >
            <h4 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", margin: "0 0 var(--space-3) 0" }}>
              {idx + 1}. {q.question}
            </h4>

            {q.type === "single_choice" && q.options && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSingleSelect(q.id, opt)}
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${isSelected ? "var(--color-text)" : "var(--color-border-strong)"}`,
                        background: isSelected ? "var(--color-text)" : "var(--color-bg)",
                        color: isSelected ? "var(--color-text-inverse)" : "var(--color-text)",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "var(--text-sm)",
                        fontWeight: isSelected ? "var(--weight-semibold)" : "var(--weight-normal)",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "multi_choice" && q.options && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                {q.options.map((opt) => {
                  const isSelected = ((answers[q.id] as string[]) || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleMultiSelect(q.id, opt)}
                      style={{
                        padding: "var(--space-3) var(--space-4)",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${isSelected ? "var(--color-text)" : "var(--color-border-strong)"}`,
                        background: isSelected ? "var(--color-text)" : "var(--color-bg)",
                        color: isSelected ? "var(--color-text-inverse)" : "var(--color-text)",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "var(--text-sm)",
                        fontWeight: isSelected ? "var(--weight-semibold)" : "var(--weight-normal)",
                      }}
                    >
                      {isSelected ? "✓ " : "○ "} {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === "short_text" && (
              <input
                type="text"
                className="input"
                placeholder="Type your response..."
                value={answers[q.id] || ""}
                onChange={(e) => handleTextChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
          <Button type="submit" variant="primary" loading={isLoading}>
            Generate Career Recommendations
          </Button>
        </div>
      </form>
    </Card>
  );
}
