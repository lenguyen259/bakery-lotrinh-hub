import Link from "next/link";
import { getDictionary } from "@/i18n";
import { getDemoRole, getLocale } from "@/lib/session";
import {
  setRoleColleague,
  setRoleSponsor,
  setRoleTrainer,
  toggleLocale,
} from "@/app/actions";
import type { DemoRole } from "@/server/access";

const links = [
  { href: "/", key: "home" as const },
  { href: "/backlog", key: "backlog" as const },
  { href: "/roadmap", key: "roadmap" as const },
  { href: "/ideas", key: "ideas" as const },
  { href: "/report", key: "report" as const },
  { href: "/training", key: "training" as const },
  { href: "/adoption", key: "adoption" as const },
  { href: "/trust", key: "trust" as const },
];

export async function SiteHeader() {
  const locale = await getLocale();
  const role = await getDemoRole();
  const t = getDictionary(locale);

  return (
    <header className="border-b border-cocoa/15 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-cocoa/70">{t.kicker}</p>
          <Link href="/" className="font-display text-2xl text-ink">
            {t.wordmark}
          </Link>
        </div>
        <nav className="flex flex-1 flex-wrap gap-2 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 text-ink/80 hover:bg-caramel/15 hover:text-ink"
            >
              {t.nav[link.key]}
            </Link>
          ))}
        </nav>
        <form action={toggleLocale.bind(null, locale)}>
          <button
            type="submit"
            className="rounded-full border border-cocoa/20 px-3 py-1 text-sm"
          >
            {t.locale}
          </button>
        </form>
        <RoleSwitcher role={role} label={t.role.label} roles={t.role} />
      </div>
    </header>
  );
}

function RoleSwitcher({
  role,
  label,
  roles,
}: {
  role: DemoRole;
  label: string;
  roles: { colleague: string; trainer: string; sponsor: string };
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-cocoa/70">{label}</span>
      <form action={setRoleColleague}>
        <button
          type="submit"
          className={`rounded-full px-3 py-1 ${
            role === "colleague"
              ? "bg-pandan text-paper"
              : "border border-cocoa/20 text-ink/80"
          }`}
        >
          {roles.colleague}
        </button>
      </form>
      <form action={setRoleTrainer}>
        <button
          type="submit"
          className={`rounded-full px-3 py-1 ${
            role === "trainer"
              ? "bg-pandan text-paper"
              : "border border-cocoa/20 text-ink/80"
          }`}
        >
          {roles.trainer}
        </button>
      </form>
      <form action={setRoleSponsor}>
        <button
          type="submit"
          className={`rounded-full px-3 py-1 ${
            role === "sponsor"
              ? "bg-pandan text-paper"
              : "border border-cocoa/20 text-ink/80"
          }`}
        >
          {roles.sponsor}
        </button>
      </form>
    </div>
  );
}
