"use client";

// ============================================================
// SkillInput — Collects skills, levels, background (FR-C1)
// ============================================================

import React, { useState } from "react";
import type { Skill, SkillLevel } from "@/api/types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SkillInputProps {
  onSubmit: (data: { skills: Skill[]; background?: string; interests?: string }) => void;
  isLoading: boolean;
}

export function SkillInput({ onSubmit, isLoading }: SkillInputProps) {
  const [skills, setSkills] = useState<Skill[]>([
    { name: "JavaScript", level: "intermediate" },
    { name: "React", level: "intermediate" },
  ]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("intermediate");
  const [background, setBackground] = useState("");
  const [interests, setInterests] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      setError("This skill is already in your list.");
      return;
    }

    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName("");
    setError(null);
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0) {
      setError("Please add at least 1 skill to begin career analysis.");
      return;
    }
    setError(null);
    onSubmit({
      skills,
      background: background.trim() || undefined,
      interests: interests.trim() || undefined,
    });
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <div>
        <h2 style={{ fontSize: "var(--text-2xl)", fontWeight: "var(--weight-bold)", margin: "0 0 var(--space-2) 0" }}>
          Explore Career Pathways
        </h2>
        <p style={{ margin: 0, color: "var(--color-text-subtle)", fontSize: "var(--text-sm)" }}>
          Tell us about your current technical proficiencies and what you enjoy doing. We will discover high-fit target roles and roadmap the gaps.
        </p>
      </div>

      <Card style={{ padding: "var(--space-6)" }}>
        <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", margin: "0 0 var(--space-3) 0" }}>
          Current Skills ({skills.length})
        </h3>

        {/* Existing skills tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-5)" }}>
          {skills.length === 0 ? (
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontStyle: "italic" }}>
              No skills added yet. Add at least 1 skill below.
            </p>
          ) : (
            skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  background: "var(--color-bg-subtle)",
                  border: "1px solid var(--color-border-strong)",
                  borderRadius: "var(--radius-full)",
                  padding: "var(--space-1) var(--space-3)",
                  fontSize: "var(--text-xs)",
                }}
              >
                <strong>{skill.name}</strong>
                <span style={{ color: "var(--color-text-muted)" }}>({skill.level})</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-subtle)",
                    fontSize: "var(--text-sm)",
                    padding: 0,
                    lineHeight: 1,
                  }}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add skill input */}
        <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: "160px" }}>
            <label htmlFor="new-skill-name" className="label" style={{ marginBottom: "var(--space-1)" }}>
              Add Skill
            </label>
            <input
              id="new-skill-name"
              type="text"
              className="input"
              placeholder="e.g. TypeScript, Python, Docker..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: "130px" }}>
            <label htmlFor="new-skill-level" className="label" style={{ marginBottom: "var(--space-1)" }}>
              Level
            </label>
            <select
              id="new-skill-level"
              className="select"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <Button type="button" variant="secondary" onClick={handleAddSkill}>
            + Add
          </Button>
        </div>

        {error && <p style={{ color: "var(--color-danger)", fontSize: "var(--text-xs)", marginTop: "var(--space-2)" }}>{error}</p>}
      </Card>

      {/* Background and Interests */}
      <Card style={{ padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <Textarea
          id="background-input"
          label="Education / Experience Context"
          optional
          placeholder="e.g. 2 years self-taught web development, CS student, non-tech career transition..."
          rows={3}
          value={background}
          onChange={(e) => setBackground(e.target.value)}
        />

        <Textarea
          id="interests-input"
          label="Interests & Aspirations"
          optional
          placeholder="e.g. Interested in backend distributed systems, AI applications, design engineering..."
          rows={3}
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        />
      </Card>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading || skills.length === 0}
        onClick={handleSubmit}
      >
        Analyze Career Paths →
      </Button>
    </div>
  );
}
