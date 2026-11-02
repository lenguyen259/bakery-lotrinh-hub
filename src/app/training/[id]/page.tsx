import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";
import { TrainingQuiz } from "@/components/TrainingQuiz";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function TrainingModulePage({ params }: Params) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);

  const trainingModule = await prisma.module.findUnique({
    where: { id },
    include: { questions: { orderBy: { id: "asc" } } },
  });

  if (!trainingModule) {
    return <p>Không tìm thấy bài.</p>;
  }

  const questions = trainingModule.questions.map((q) => ({
    id: q.id,
    promptVi: q.promptVi,
    promptEn: q.promptEn,
    choicesVi: q.choicesVi as string[],
    choicesEn: q.choicesEn as string[],
  }));

  return (
    <div>
      <h1 className="font-display text-3xl">
        {locale === "vi" ? trainingModule.titleVi : trainingModule.titleEn}
      </h1>
      <article className="mt-4 rounded-2xl border border-cocoa/15 bg-white/40 p-5 text-sm leading-relaxed">
        {locale === "vi" ? trainingModule.bodyVi : trainingModule.bodyEn}
      </article>
      <TrainingQuiz moduleId={trainingModule.id} questions={questions} locale={locale} />
      <p className="mt-4 text-xs text-cocoa/60">{t.training.pass}</p>
    </div>
  );
}
