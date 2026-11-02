import Link from "next/link";
import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const modules = await prisma.module.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl">{t.training.title}</h1>
      <p className="mt-2 text-sm text-cocoa/70">{t.training.pass}</p>
      <ul className="mt-6 space-y-3">
        {modules.map((mod) => (
          <li key={mod.id}>
            <Link
              href={`/training/${mod.id}`}
              className="block rounded-xl border border-cocoa/15 bg-white/40 px-4 py-3 hover:border-pandan/40"
            >
              {locale === "vi" ? mod.titleVi : mod.titleEn}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
