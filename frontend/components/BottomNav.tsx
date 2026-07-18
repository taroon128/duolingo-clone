"use client";

/**
 * BottomNav — Task 18.
 *
 * Duolingo's persistent bottom tab bar: Home and Profile tabs.
 * Placed in layout.tsx so it appears on every page — the lesson
 * player hides it naturally because it uses its own fixed-bottom
 * UI (feedback bar, check button).
 *
 * "use client" — uses usePathname to highlight the active tab.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Learn", Icon: Home },
  { href: "/profile", label: "Profile", Icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show the nav bar inside the lesson player — it would fight
  // with the FeedbackBar and Check button that are also fixed-bottom.
  if (pathname.startsWith("/lesson")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-duo-gray bg-white">
      <div className="mx-auto flex max-w-2xl">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors",
                isActive
                  ? "text-duo-blue"
                  : "text-duo-gray-dark hover:text-duo-text",
              ].join(" ")}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? "currentColor" : "none"}
              />
              <span className="font-display text-xs font-bold">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
