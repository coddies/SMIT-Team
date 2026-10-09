"use client";

// ============================================================
// Landing Page — Minimalist Monochrome Studio Theme (FR-L1)
// ============================================================

import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* ── Section 1: Hero & Vision ────────────────────────── */}
      <section
        className="landing-hero"
        style={{
          padding: "var(--space-20) 0 var(--space-16)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-2)",
              padding: "4px 12px",
              borderRadius: "var(--radius-full)",
              background: "var(--color-bg-subtle)",
              border: "1px solid var(--color-border)",
              fontSize: "var(--text-xs)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text-subtle)",
              marginBottom: "var(--space-6)",
            }}
          >
            <span>FinishAI Execution Engine</span>
            <span>•</span>
            <span>Zero Fluff, Pure Output</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "var(--weight-bold)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "var(--color-text)",
              margin: "0 0 var(--space-6) 0",
            }}
          >
            Turn ambitious goals into daily execution.
          </h1>

          <p
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-text-subtle)",
              lineHeight: "var(--leading-relaxed)",
              margin: "0 0 var(--space-8) 0",
              fontWeight: "var(--weight-normal)",
            }}
          >
            Write your goal in any language. FinishAI deconstructs it into milestones, schedules realistic daily tasks, dynamically re-plans when life happens, and always highlights your next best action.
          </p>

          <div
            className="landing-cta-row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "var(--space-4)",
              flexWrap: "wrap",
            }}
          >
            <Link href="/new" className="btn btn-primary btn-lg">
              Set Your Goal Now →
            </Link>
            <Link href="/career" className="btn btn-secondary btn-lg">
              Explore Career Paths
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 2: The Three Pillars ─────────────────────── */}
      <section
        className="landing-section"
        style={{
          padding: "var(--space-20) 0",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div
            className="landing-features"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-8)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-bold)",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                }}
              >
                01 / Scoped Roadmapping
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", margin: 0 }}>
                Realistic milestones, not wishful thinking
              </h3>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-subtle)", lineHeight: "var(--leading-relaxed)" }}>
                Algorithms verify feasibility against your actual daily hours. If your deadline is unrealistic, FinishAI tells you honestly before you waste time.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-bold)",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                }}
              >
                02 / Next Best Action
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", margin: 0 }}>
                Eliminate decision paralysis
              </h3>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-subtle)", lineHeight: "var(--leading-relaxed)" }}>
                Never wonder what to work on next. A dedicated single-task focus module shows you the exact high-impact action to complete today.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: "var(--weight-bold)",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  textTransform: "uppercase",
                }}
              >
                03 / Intelligent Re-planning
              </div>
              <h3 style={{ fontSize: "var(--text-xl)", fontWeight: "var(--weight-bold)", margin: 0 }}>
                Missed a day? Your roadmap adapts
              </h3>
              <p style={{ margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-subtle)", lineHeight: "var(--leading-relaxed)" }}>
                Mark missed tasks with zero guilt. The AI automatically reschedules remaining work, rebalances workload, and keeps your finish line in sight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Call to Action ────────────────────────── */}
      <section className="landing-section" style={{ padding: "var(--space-20) 0", background: "var(--color-bg-subtle)" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "600px" }}>
          <h2 style={{ fontSize: "var(--text-3xl)", fontWeight: "var(--weight-bold)", margin: "0 0 var(--space-4) 0" }}>
            Ready to finish what you start?
          </h2>
          <p style={{ margin: "0 0 var(--space-8) 0", fontSize: "var(--text-base)", color: "var(--color-text-subtle)" }}>
            No credit card, no sign-up forms. Start building your execution roadmap immediately.
          </p>
          <Link href="/new" className="btn btn-primary btn-lg">
            Create Free Execution Plan →
          </Link>
        </div>
      </section>
    </div>
  );
}
