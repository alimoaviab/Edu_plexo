"use client";

import { colors, componentSizing, radius, spacing, typography } from "@edu/shared/design-system/tokens";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, style, ...props }: InputProps) {
  const inputId = id ?? props.name;

  // When label is provided, render with label wrapper; otherwise render input directly
  if (label) {
    return (
      <label style={{ display: "grid", gap: spacing.xs }}>
        <span style={{ ...typography.labelMd, color: colors.onSurfaceVariant }}>{label}</span>
        <input
          id={inputId}
          {...props}
          style={{
            height: componentSizing.inputHeight,
            borderRadius: radius.default,
            border: `1px solid ${colors.cardBorder}`,
            background: colors.surfaceContainerLowest,
            color: colors.onSurface,
            padding: `0 ${spacing.sm}px`,
            outlineColor: colors.actionBlue,
            ...style
          }}
        />
      </label>
    );
  }

  // When used inside FormGroup, render input without label wrapper
  return (
    <input
      id={inputId}
      {...props}
      style={{
        height: componentSizing.inputHeight,
        borderRadius: radius.default,
        border: `1px solid ${colors.cardBorder}`,
        background: colors.surfaceContainerLowest,
        color: colors.onSurface,
        padding: `0 ${spacing.sm}px`,
        outlineColor: colors.actionBlue,
        ...style
      }}
    />
  );
}
