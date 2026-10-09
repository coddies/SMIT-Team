"use client";

// ============================================================
// Card — Standard container for modules and items
// ============================================================

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  emphasis?: boolean;
}

export function Card({
  hover = false,
  emphasis = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const classes = [
    "card",
    hover ? "card-hover" : "",
    emphasis ? "card-emphasis" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
