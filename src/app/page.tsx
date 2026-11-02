import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";
import { Pipeline } from "@/components/Pipeline";
import {
  computeOutletRates,
  type PersonRow,
} from "@/server/adoption";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  let workItems: Awaited<ReturnType<typeof prisma.workItem.findMany>> = [];
  let people: Awaited<ReturnType<typeof prisma.person.findMany>> = [];
  let completions: Awaited<ReturnType<typeof prisma.completion.findMany>> = [];
  let dbError = false;

  try {
    workItems = await prisma.workItem.findMany();
    people = await prisma.person.findMany();
    completions = await prisma.completion.findMany();
  } catch {
    dbError = true;
  }

  const released = workItems.filter((w) => w.stage === "released");
  const inTest = workItems.filter((w) =>
    ["test", "prototype"].includes(w.stage),
  );

  const personRows: PersonRow[] = people.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    outletId: p.outletId,
  }));
  const rates = computeOutletRates(
    personRows,
    completions.map((c) => ({
      personId: c.personId,
      moduleId: c.moduleId,
      passed: c.passed,
    })),
  );

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-4xl text-ink">{t.home.headline}</h1>
        <p className="mt-2 text-cocoa/80">{t.home.sub}</p>
        {dbError ? (
          <p className="mt-4 rounded-xl border border-caramel/40 bg-caramel/10 px-4 py-3 text-sm text-cocoa">
            {locale === "vi"
              ? "Không kết nối được cơ sở dữ liệu. Thêm DATABASE_URL trên Vercel, chạy migrate và seed."
              : "Database unavailable. Set DATABASE_URL on Vercel, then run migrate and seed."}
          </p>
        ) : null}
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-pandan/30 bg-pandan/10 p-4">
          <p className="text-sm text-cocoa/70">{t.home.released}</p>
          <p className="font-display text-3xl">{released.length}</p>
        </div>
        <div className="rounded-2xl border border-caramel/30 bg-caramel/10 p-4">
          <p className="text-sm text-cocoa/70">{t.home.inTest}</p>
          <p className="font-display text-3xl">{inTest.length}</p>
        </div>
        <div className="rounded-2xl border border-cocoa/20 bg-white/40 p-4">
          <p className="text-sm text-cocoa/70">{t.home.adoption}</p>
          <ul className="mt-2 space-y-1 text-sm">
            {rates.map((r) => (
              <li key={r.outletId}>
                {locale === "vi" ? r.nameVi : r.nameEn}:{" "}
                <strong>{r.rate}%</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">{t.home.demoLinks}</h2>
        <div className="mt-4">
          <Pipeline items={released} showLinks />
        </div>
      </section>
    </div>
  );
}
