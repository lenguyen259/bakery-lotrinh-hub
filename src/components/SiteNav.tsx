"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", key: "home" },
  { href: "/backlog", key: "backlog" },
  { href: "/roadmap", key: "roadmap" },
  { href: "/ideas", key: "ideas" },
  { href: "/report", key: "report" },
  { href: "/training", key: "training" },
  { href: "/adoption", key: "adoption" },
  { href: "/trust", key: "trust" },
] as const;

type NavLabels = Record<(typeof links)[number]["key"], string>;

export function SiteNav({ labels }: { labels: NavLabels }) {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-t border-cocoa/10 pt-3 text-sm"
      aria-label="Main"
    >
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 border-b-2 px-3 py-2 transition-colors ${
              active
                ? "border-pandan font-medium text-ink"
                : "border-transparent text-ink/70 hover:border-cocoa/20 hover:text-ink"
            }`}
          >
            {labels[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}
