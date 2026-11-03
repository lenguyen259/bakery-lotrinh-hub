import Link from "next/link";
import { getDictionary } from "@/i18n";
import { getDemoRole, getLocale } from "@/lib/session";
import {
  setRoleColleague,
  setRoleSponsor,
  setRoleTrainer,
  toggleLocale,
} from "@/app/actions";
import { SiteNav } from "@/components/SiteNav";
import type { DemoRole } from "@/server/access";

export async function SiteHeader() {
  const locale = await getLocale();
  const role = await getDemoRole();
  const t = getDictionary(locale);

  return (
    <header className="border-b border-cocoa/10 bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-cocoa/60">
              {t.kicker}
            </p>
            <Link href="/" className="font-display text-3xl leading-tight text-ink">
              {t.wordmark}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <form action={toggleLocale.bind(null, locale)}>
              <button
                type="submit"
                className="rounded-md border border-cocoa/15 bg-white/50 px-3 py-1.5 text-sm text-ink/80 hover:border-cocoa/30"
              >
                {t.locale}
              </button>
            </form>
            <RoleSwitcher role={role} label={t.role.label} roles={t.role} />
          </div>
        </div>
        <SiteNav labels={t.nav} />
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
    <div className="flex flex-col gap-1 sm:items-end">
      <span className="text-xs text-cocoa/60">{label}</span>
      <div className="inline-flex rounded-lg border border-cocoa/15 bg-white/40 p-0.5">
        <form action={setRoleColleague}>
          <button
            type="submit"
            className={`rounded-md px-2.5 py-1.5 text-xs sm:text-sm ${
              role === "colleague"
                ? "bg-pandan text-paper shadow-sm"
                : "text-ink/75 hover:bg-paper"
            }`}
          >
            {roles.colleague}
          </button>
        </form>
        <form action={setRoleTrainer}>
          <button
            type="submit"
            className={`rounded-md px-2.5 py-1.5 text-xs sm:text-sm ${
              role === "trainer"
                ? "bg-pandan text-paper shadow-sm"
                : "text-ink/75 hover:bg-paper"
            }`}
          >
            {roles.trainer}
          </button>
        </form>
        <form action={setRoleSponsor}>
          <button
            type="submit"
            className={`rounded-md px-2.5 py-1.5 text-xs sm:text-sm ${
              role === "sponsor"
                ? "bg-pandan text-paper shadow-sm"
                : "text-ink/75 hover:bg-paper"
            }`}
          >
            {roles.sponsor}
          </button>
        </form>
      </div>
    </div>
  );
}
