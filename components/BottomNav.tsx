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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/matches")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors"
              style={{ color: active ? "var(--accent)" : "var(--muted)" }}
            >
              {active && (
                <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-accent" />
              )}
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
