import { getDictionary } from "@/i18n";
import { getLocale } from "@/lib/session";

export async function DisclaimerFooter() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return (
    <footer className="mt-auto border-t border-cocoa/15 bg-paper px-4 py-6 text-sm text-cocoa/80">
      <p className="mx-auto max-w-6xl leading-relaxed">{t.disclaimer}</p>
    </footer>
  );
}
