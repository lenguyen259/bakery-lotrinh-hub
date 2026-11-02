import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getDemoRole, getLocale } from "@/lib/session";
import { IdeaActions } from "@/components/IdeaActions";
import { canAccept, canShape } from "@/server/access";
import type { ShapeOutput } from "@/server/shape-policy";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const role = await getDemoRole();
  const ideas = await prisma.idea.findMany({
    include: { author: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">{t.ideas.title}</h1>
      <ul className="space-y-4">
        {ideas.map((idea) => {
          const shaped = idea.shapedJson as ShapeOutput | null;
          return (
            <li
              key={idea.id}
              className="rounded-2xl border border-cocoa/15 bg-white/40 p-5"
            >
              <div className="text-xs uppercase tracking-wide text-cocoa/60">
                {idea.id} · {idea.author.name}
              </div>
              <p className="mt-2 text-ink">{idea.body}</p>
              <p className="mt-1 text-sm text-cocoa/70">
                {t.stages[idea.status === "new" ? "inbox" : "shaped"]} ·{" "}
                {idea.confidence != null
                  ? `confidence ${Number(idea.confidence).toFixed(1)}`
                  : "—"}
              </p>
              {shaped ? (
                <div className="mt-3 rounded-xl bg-paper p-3 text-sm">
                  <p className="font-medium">{shaped.title}</p>
                  <ul className="mt-2 list-disc pl-5">
                    {shaped.acceptance.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <IdeaActions
                ideaId={idea.id}
                canShape={canShape(role)}
                canAccept={canAccept(role)}
                hasShape={Boolean(shaped)}
                confidenceOk={
                  idea.confidence != null && Number(idea.confidence) >= 0.4
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
