import { prisma } from "@/lib/db";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function BacklogPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const items = await prisma.workItem.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1 className="font-display text-3xl">{t.nav.backlog}</h1>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-cocoa/20 text-cocoa/70">
              <th className="py-2">ID</th>
              <th>{locale === "vi" ? "Khu vực" : "Area"}</th>
              <th>{locale === "vi" ? "Giai đoạn" : "Stage"}</th>
              <th>{locale === "vi" ? "Tiêu đề" : "Title"}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-cocoa/10">
                <td className="py-3 font-mono text-xs">{item.id}</td>
                <td>{t.areas[item.area as keyof typeof t.areas] ?? item.area}</td>
                <td>{t.stages[item.stage as keyof typeof t.stages] ?? item.stage}</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
