import { getAiBannerMode } from "@/lib/ai/client";
import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";

export async function AiModeBanner() {
  const mode = getAiBannerMode();
  const locale = await getLocale();
  const t = getDictionary(locale);
  const text =
    mode === "demo"
      ? t.aiBanner.demo
      : mode === "fallback"
        ? t.aiBanner.fallback
        : t.aiBanner.live;
  const tone =
    mode === "live"
      ? "bg-pandan/15 text-pandan border-pandan/30"
      : "bg-caramel/15 text-cocoa border-caramel/30";

  return (
    <div
      className={`border-b px-4 py-2 text-center text-sm ${tone}`}
      data-ai-mode={mode}
    >
      {text}
    </div>
  );
}
