"use client";

// ============================================================
// Textarea — Multi-line input with RTL support and validation
// ============================================================

import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, optional, id, className = "", ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="field">
        {label && (
          <label htmlFor={textareaId} className="label">
            {label}
            {optional && <span className="label-optional">(optional)</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          dir="auto"
          className={`textarea ${error ? "error" : ""} ${className}`}
          {...props}
        />
        {hint && !error && <span className="field-hint">{hint}</span>}
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
