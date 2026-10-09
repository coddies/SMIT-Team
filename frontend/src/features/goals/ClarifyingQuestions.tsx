"use client";

// ============================================================
// ClarifyingQuestions — Prompted when AI needs more details (FR-G3)
// ============================================================

import React, { useState } from "react";
import type { ClarifyingQuestion } from "@/api/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressMessages } from "@/components/ui/ProgressMessages";

interface ClarifyingQuestionsProps {
  questions: ClarifyingQuestion[];
  onSubmitAnswers: (answers: Record<string, string>) => void;
  isLoading: boolean;
}

export function ClarifyingQuestions({
  questions,
  onSubmitAnswers,
  isLoading,
}: ClarifyingQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleTextChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleOptionSelect = (id: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
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
          Clarifying Details
        </span>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", marginTop: "var(--space-1)" }}>
          A couple quick questions to tailor your plan
        </h2>
        <p style={{ color: "var(--color-text-subtle)", fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>
          Answer as much as you can, or skip if you want the AI to make sensible defaults.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {questions.slice(0, 2).map((q, idx) => (
          <div
            key={q.id}
            style={{
              padding: "var(--space-5)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-subtle)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
              <label
                htmlFor={`q-${q.id}`}
                style={{
                  fontWeight: "var(--weight-semibold)",
                  fontSize: "var(--text-base)",
                  color: "var(--color-text)",
                }}
              >
                {idx + 1}. {q.question}
              </label>
              <button
                type="button"
                onClick={() => handleTextChange(q.id, "")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Clear
              </button>
            </div>

            <input
              id={`q-${q.id}`}
              dir="auto"
              type="text"
              className="input"
              placeholder="Type your response here..."
              value={answers[q.id] || ""}
              onChange={(e) => handleTextChange(q.id, e.target.value)}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end", marginTop: "var(--space-4)" }}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onSubmitAnswers({})}
            disabled={isLoading}
          >
            Skip and generate anyway
          </Button>
          <Button type="submit" variant="primary" loading={isLoading}>
            Continue with Answers
          </Button>
        </div>
      </form>
    </Card>
  );
}
