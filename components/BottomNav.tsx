"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Swords, BarChart3, Users, type LucideIcon } from "lucide-react";

const items: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "Utakmice", Icon: Swords },
  { href: "/stats", label: "Statistika", Icon: BarChart3 },
  { href: "/players", label: "Igrači", Icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(14px,env(safe-area-inset-bottom))]">
      <div className="nav-island pointer-events-auto mx-auto flex max-w-[21rem] gap-1 p-1.5">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/matches")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="press flex flex-1 flex-col items-center gap-1 rounded-[18px] py-2 text-[11px] font-medium transition-colors"
              style={{
                color: active ? "var(--foreground)" : "var(--muted)",
                background: active ? "rgba(255,255,255,0.11)" : "transparent",
                boxShadow: active
                  ? "0 1px 3px rgba(0,0,0,0.35), var(--highlight)"
                  : "none",
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.3 : 1.9}
                style={{ color: active ? "var(--accent)" : "inherit" }}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
