import Link from "next/link";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";

type Item = {
  id: string;
  title: string;
  stage: string;
  area: string;
  externalUrl: string | null;
};

export async function Pipeline({
  items,
  showLinks = false,
}: {
  items: Item[];
  showLinks?: boolean;
}) {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-xl border border-cocoa/15 bg-white/40 p-4 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-cocoa/70">
            <span>{item.id}</span>
            <span>{t.areas[item.area as keyof typeof t.areas] ?? item.area}</span>
            <span>{t.stages[item.stage as keyof typeof t.stages] ?? item.stage}</span>
          </div>
          <p className="mt-1 font-medium text-ink">{item.title}</p>
          {showLinks && (item.id === "LT-01" || item.id === "LT-02") ? (
            <p className="mt-2 text-sm">
              {item.externalUrl ? (
                <Link
                  href={item.externalUrl}
                  className="text-pandan underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.externalUrl}
                </Link>
              ) : (
                <span className="text-caramel">{t.home.urlUnset}</span>
              )}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
