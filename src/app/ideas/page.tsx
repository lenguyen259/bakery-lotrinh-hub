import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getDemoRole, getLocale } from "@/lib/session";
import { IdeaActions } from "@/components/IdeaActions";
import { canAccept, canShape } from "@/server/access";
import { isTooVague, type ShapeOutput } from "@/server/shape-policy";

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
    <div className="space-y-8">
      <header className="max-w-2xl space-y-2">
        <h1 className="font-display text-3xl text-ink">{t.ideas.title}</h1>
        <p className="text-sm leading-relaxed text-cocoa/80">
          {locale === "vi"
            ? "Ghi chú từ đồng nghiệp được định hình có kiểm soát — không tự chèn số liệu."
            : "Colleague notes are shaped under guardrails — no invented KPIs or amounts."}
        </p>
      </header>
      <ul className="grid gap-5">
        {ideas.map((idea) => {
          const shaped = idea.shapedJson as ShapeOutput | null;
          const confidence =
            idea.confidence != null ? Number(idea.confidence) : null;
          const tooVague =
            idea.id === "idea-vague" ||
            confidence == null ||
            isTooVague(confidence);
          const showShaped = Boolean(shaped) && !tooVague;
          const missingInfo = (idea.missingInfo as string[] | null) ?? [];

          return (
            <li
              key={idea.id}
              className="rounded-xl border border-cocoa/12 bg-white/50 shadow-sm"
            >
              <div className="border-b border-cocoa/8 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-cocoa/55">
                    {idea.id}
                  </p>
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      showShaped
                        ? "bg-pandan/15 text-pandan"
                        : "bg-cocoa/8 text-cocoa/80"
                    }`}
                  >
                    {showShaped ? t.stages.shaped : t.stages.inbox}
                    {confidence != null ? ` · ${confidence.toFixed(1)}` : ""}
                  </span>
                </div>
                <p className="mt-3 font-display text-xl leading-snug text-ink">
                  {idea.body}
                </p>
                <p className="mt-2 text-sm text-cocoa/65">{idea.author.name}</p>
              </div>

              {tooVague ? (
                <div className="border-b border-cocoa/8 px-5 py-4 text-sm text-cocoa/85 sm:px-6">
                  {t.ideas.tooVague}
                  {missingInfo.length ? (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-cocoa/75">
                      {missingInfo.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ) : null}

              {showShaped && shaped ? (
                <div className="border-b border-cocoa/8 px-5 py-4 sm:px-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-cocoa/55">
                    {t.ideas.shaped}
                  </p>
                  <p className="mt-2 font-medium text-ink">{shaped.title}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/90">
                    {shaped.acceptance.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-caramel" aria-hidden>
                          ·
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="px-5 py-4 sm:px-6">
                <IdeaActions
                  ideaId={idea.id}
                  canShape={canShape(role)}
                  canAccept={canAccept(role)}
                  hasShape={showShaped}
                  confidenceOk={!tooVague}
                  labels={{
                    shape: t.ideas.shape,
                    accept: t.ideas.accept,
                    tooVague: t.ideas.tooVague,
                    shapedOk: t.ideas.shaped,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
