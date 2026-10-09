"use client";

// ============================================================
// Input — Text input with label, error message, and hint
// ============================================================

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, optional, id, className = "", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="field">
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {optional && <span className="label-optional">(optional)</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          dir="auto"
          className={`input ${error ? "error" : ""} ${className}`}
          {...props}
        />
        {hint && !error && <span className="field-hint">{hint}</span>}
        {error && <span className="field-error">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
