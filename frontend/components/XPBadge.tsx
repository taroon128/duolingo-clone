import { Zap } from "lucide-react";

/**
 * Reusable XPBadge — Task 15.
 *
 * A small gold pill showing an XP amount with a lightning-bolt icon —
 * Duolingo's actual visual convention for XP. No "use client" — purely
 * presentational, no handlers, no state.
 */
interface XPBadgeProps {
  amount: number;
  className?: string;
}

export default function XPBadge({ amount, className = "" }: XPBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full
        bg-duo-gold/15 px-3 py-1
        text-sm font-bold text-duo-gold-dark
        ${className}
      `}
    >
      <Zap size={16} fill="currentColor" strokeWidth={0} aria-hidden="true" />
      {amount} XP
    </span>
  );
}
