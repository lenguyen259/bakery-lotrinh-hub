import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";
import { Pipeline } from "@/components/Pipeline";

export const dynamic = "force-dynamic";

function columnForStage(stage: string): "now" | "next" | "later" | "parked" {
  if (stage === "released") return "now";
  if (stage === "test" || stage === "prototype") return "next";
  if (stage === "parked") return "parked";
  return "later";
}

export default async function RoadmapPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const items = await prisma.workItem.findMany({ orderBy: { id: "asc" } });

  const grouped = {
    now: items.filter((i) => columnForStage(i.stage) === "now"),
    next: items.filter((i) => columnForStage(i.stage) === "next"),
    later: items.filter((i) => columnForStage(i.stage) === "later"),
    parked: items.filter((i) => columnForStage(i.stage) === "parked"),
  };

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">{t.nav.roadmap}</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        {(["now", "next", "later"] as const).map((key) => (
          <section key={key}>
            <h2 className="font-display text-xl text-pandan">{t.roadmap[key]}</h2>
            <div className="mt-3">
              <Pipeline items={grouped[key]} />
            </div>
          </section>
        ))}
      </div>
      <section>
        <h2 className="font-display text-xl text-clay">{t.roadmap.parked}</h2>
        <div className="mt-3">
          <Pipeline items={grouped.parked} />
        </div>
      </section>
    </div>
  );
}
