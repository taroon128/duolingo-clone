"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Reusable Button — Task 15.
 *
 * Marked "use client": a button that accepts an onClick handler needs
 * client-side JS to bind the event, so this can't be a Server
 * Component the way ProgressBar/Heart/XPBadge can (see their files).
 *
 * The signature Duolingo interaction — a chunky bottom "3D" border
 * that disappears and the button drops down 4px on press — is what
 * makes this read as Duolingo rather than a generic rounded button.
 * That's `border-b-4` normally, `active:border-b-0 active:translate-y-1`
 * on press. No API calls here (per this task's "No API" instruction) —
 * onClick is just passed through from whatever calls this.
 */
type ButtonVariant = "primary" | "secondary" | "danger" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-duo-green border-duo-green-dark text-white",
  secondary: "bg-duo-blue border-duo-blue-dark text-white",
  danger: "bg-duo-red border-duo-red-dark text-white",
  outline: "bg-white border-duo-gray text-duo-text",
};

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : ""}
        ${VARIANT_STYLES[variant]}
        rounded-2xl border-b-4 px-6 py-3
        text-sm font-bold uppercase tracking-wide
        transition-transform duration-100
        active:translate-y-1 active:border-b-0
        disabled:cursor-not-allowed disabled:opacity-50
        disabled:active:translate-y-0 disabled:active:border-b-4
        cursor-pointer
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
