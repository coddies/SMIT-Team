"use client";

// ============================================================
// Navbar — Minimalist Monochrome Header (Mobile Responsive)
// ============================================================

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const { storageUnavailable } = useAppSelector((state) => state.session);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {storageUnavailable && (
        <div
          style={{
            background: "var(--color-warning-bg)",
            color: "var(--color-warning)",
            padding: "var(--space-2) var(--space-4)",
            fontSize: "var(--text-xs)",
            textAlign: "center",
            borderBottom: "1px solid rgba(138,95,0,0.15)",
          }}
        >
          Storage is disabled in your browser. Progress will be lost if you refresh this tab.
        </div>
      )}
      <header
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Left: Logo + Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}>
            <Link
              href="/"
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: "var(--weight-bold)",
                letterSpacing: "-0.02em",
                color: "var(--color-text)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <span>FinishAI</span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "var(--weight-semibold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: "var(--color-bg-subtle)",
                  padding: "2px 6px",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-text-subtle)",
                }}
              >
                STUDIO
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
              <Link
                href="/new"
                style={{
                  fontSize: "var(--text-sm)",
                  color: pathname === "/new" ? "var(--color-text)" : "var(--color-text-subtle)",
                  fontWeight: pathname === "/new" ? "var(--weight-medium)" : "var(--weight-normal)",
                  textDecoration: "none",
                }}
              >
                New Goal
              </Link>
              <Link
                href="/career"
                style={{
                  fontSize: "var(--text-sm)",
                  color: pathname.startsWith("/career") ? "var(--color-text)" : "var(--color-text-subtle)",
                  fontWeight: pathname.startsWith("/career") ? "var(--weight-medium)" : "var(--weight-normal)",
                  textDecoration: "none",
                }}
              >
                Career Path
              </Link>
            </nav>
          </div>

          {/* Right: Theme toggle + CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <ThemeToggle />
            <Link href="/new" className="btn btn-primary btn-sm btn-desktop">
              Start Execution
            </Link>
            {/* Hamburger — visible only on mobile */}
            <button
              className="hamburger"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span style={{ transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <nav className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
          <Link href="/new" onClick={() => setMenuOpen(false)}>
            New Goal
          </Link>
          <Link href="/career" onClick={() => setMenuOpen(false)}>
            Career Path
          </Link>
          <Link
            href="/new"
            className="btn btn-primary btn-sm"
            style={{ marginTop: "var(--space-2)", justifyContent: "center" }}
            onClick={() => setMenuOpen(false)}
          >
            Start Execution →
          </Link>
        </nav>
      </header>
    </>
  );
}


