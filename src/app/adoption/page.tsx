import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getDemoRole, getLocale } from "@/lib/session";
import {
  computeOutletDetails,
  computeOutletRates,
  type PersonRow,
} from "@/server/adoption";
import { canSeeCompletionNames } from "@/server/access";

export const dynamic = "force-dynamic";

export default async function AdoptionPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const role = await getDemoRole();

  const people = await prisma.person.findMany();
  const completions = await prisma.completion.findMany();
  const personRows: PersonRow[] = people.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    outletId: p.outletId,
  }));
  const completionRows = completions.map((c) => ({
    personId: c.personId,
    moduleId: c.moduleId,
    passed: c.passed,
  }));

  const outlets = computeOutletRates(personRows, completionRows);
  const details = canSeeCompletionNames(role)
    ? computeOutletDetails(personRows, completionRows)
    : null;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">{t.nav.adoption}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {outlets.map((o) => (
          <div
            key={o.outletId}
            className="rounded-2xl border border-cocoa/15 bg-white/40 p-4"
          >
            <p className="text-sm text-cocoa/70">
              {locale === "vi" ? o.nameVi : o.nameEn}
            </p>
            <p className="font-display text-4xl text-pandan">{o.rate}%</p>
            <p className="text-xs text-cocoa/60">
              {o.finished}/{o.total}{" "}
              {locale === "vi" ? "đồng nghiệp xong cả 3 bài" : "colleagues finished all 3"}
            </p>
            {details ? (
              <div className="mt-3 text-xs text-cocoa/80">
                <p>
                  {locale === "vi" ? "Chưa xong:" : "Not finished:"}{" "}
                  {details
                    .find((d) => d.outletId === o.outletId)
                    ?.unfinishedNames.join(", ") || "—"}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
