"use client";

// ============================================================
// Button — Core Button Component
// ============================================================

import React, { forwardRef } from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const classNames = [
      "btn",
      `btn-${variant}`,
      size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "",
      fullWidth ? "btn-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" inverse={variant === "primary" || variant === "danger"} />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
