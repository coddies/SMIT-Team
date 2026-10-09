"use client";

// ============================================================
// ProgressMessages — rotating messages for long AI operations
// ============================================================

import { useState, useEffect } from "react";
import { Spinner } from "./Spinner";
import styles from "./ProgressMessages.module.css";

const DEFAULT_MESSAGES = [
  "Analyzing your goal...",
  "Building your roadmap...",
  "Scheduling daily tasks...",
  "Finding the best resources...",
  "Almost there...",
  "Finalizing your plan...",
];

type Props = {
  messages?: string[];
  intervalMs?: number;
};

export function ProgressMessages({
  messages = DEFAULT_MESSAGES,
  intervalMs = 4000,
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [messages, intervalMs]);

  return (
    <div className={styles.root} role="status" aria-live="polite">
      <Spinner size="lg" />
      <p className={styles.message} key={index}>
        {messages[index]}
      </p>
    </div>
  );
}
